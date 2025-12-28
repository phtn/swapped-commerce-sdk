/**
 * Example: Processing Payouts
 * 
 * This example demonstrates how to:
 * 1. Get a quote for currency conversion
 * 2. Check balances
 * 3. Create a payout to bank or crypto wallet
 * 4. Track payout status
 */

import { createClient } from '../src/index'

async function processPayout() {
  const client = createClient({
    apiKey: process.env.SWAPPED_API_KEY ?? '',
    environment: 'sandbox',
  })

  try {
    // Step 1: Check available balances
    console.log('Checking balances...')
    const balancesResponse = await client.balances.list()

    if (!balancesResponse.success) {
      throw new Error('Failed to fetch balances')
    }

    console.log('Available balances:')
    for (const balance of balancesResponse.data.balances) {
      console.log(
        `  ${balance.currency.symbol}: ${balance.available} (available) / ${balance.total} (total)`
      )
    }

    // Step 2: Get a quote for conversion (if needed)
    const cryptoBalance = balancesResponse.data.balances.find(
      (b) => b.currency.type === 'CRYPTO'
    )

    if (!cryptoBalance) {
      console.log('No crypto balance available for payout')
      return
    }

    console.log('\nGetting quote for conversion...')
    const quoteResponse = await client.quotes.get({
      fromCurrency: cryptoBalance.currency.id,
      toCurrency: 'USD',
      amount: '100.00',
      amountType: 'FROM',
    })

    if (!quoteResponse.success) {
      throw new Error('Failed to get quote')
    }

    const quote = quoteResponse.data.quote
    console.log(
      `Quote: ${quote.fromAmount.amount} ${quote.fromAmount.currency.symbol} = ${quote.toAmount.amount} ${quote.toAmount.currency.symbol}`
    )
    console.log(`Fees: ${quote.fees.map((f) => `${f.amount} ${f.currency.symbol}`).join(', ')}`)

    // Step 3: Create a payout to bank account
    console.log('\nCreating payout to bank account...')
    const payoutResponse = await client.payouts.create({
      amount: '50.00',
      currency: cryptoBalance.currency.id,
      destinationType: 'BANK',
      destination: {
        accountNumber: '1234567890',
        routingNumber: '987654321',
        accountHolderName: 'John Doe',
      },
      reference: 'Monthly payout - January 2024',
    })

    if (!payoutResponse.success) {
      throw new Error('Failed to create payout')
    }

    console.log('Payout created successfully!')
    console.log('Payout ID:', payoutResponse.data.payoutId)
    console.log('Status:', payoutResponse.data.status)
    console.log('Estimated arrival:', payoutResponse.data.estimatedArrival)

    // Step 4: Track payout status
    console.log('\nTracking payout status...')
    const payoutStatusResponse = await client.payouts.get(payoutResponse.data.payoutId)

    if (payoutStatusResponse.success) {
      const payout = payoutStatusResponse.data
      console.log(`Payout ${payout.id}:`)
      console.log(`  Status: ${payout.status}`)
      console.log(`  Amount: ${payout.amount} ${payout.currency.symbol}`)
      console.log(`  Created: ${payout.createdAt}`)
      if (payout.completedAt) {
        console.log(`  Completed: ${payout.completedAt}`)
      }
      if (payout.failureReason) {
        console.log(`  Failure reason: ${payout.failureReason}`)
      }
    }

    // Step 5: List all payouts
    console.log('\nListing all payouts...')
    const payoutsListResponse = await client.payouts.list({ page: 1, limit: 10 })

    if (payoutsListResponse.success) {
      console.log(`Total payouts: ${payoutsListResponse.data.pagination.totalItems}`)
      for (const payout of payoutsListResponse.data.payouts) {
        console.log(
          `  ${payout.id}: ${payout.amount} ${payout.currency.symbol} - ${payout.status}`
        )
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error processing payout:', error.message)
    } else {
      console.error('Unknown error occurred')
    }
    process.exit(1)
  }
}

// Run the example
processPayout()
