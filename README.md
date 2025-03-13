# T-NGMI Slots - Blockchain Slot Game on Sui

A 3x3 slot machine game built on the Sui blockchain, featuring the T-NGMI character and TARDI token integration.

![T-NGMI Slots Game Preview](public/assets/images/og-image.png)

## Features

- **3x3 Slot Game**: Classic slot machine gameplay with 5 paylines
- **Blockchain-Powered**: Built on Sui blockchain for provably fair gaming
- **Token Integration**: Play and win using TARDI tokens
- **T-NGMI Character**: Enjoy commentary from the T-NGMI character as you play
- **Special Symbols**: Multipliers, free spins, and jackpot opportunities
- **Provably Fair**: Verify the fairness of each spin with client-side seeds

## Technology Stack

- **Frontend**: Next.js and React with TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Sui Move smart contracts
- **Wallet Integration**: Sui wallet adapters

## Getting Started

### Prerequisites

- Node.js (v16+)
- pnpm
- Sui CLI for smart contract development
- A Sui wallet with testnet SUI tokens

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ngmi-slots.git
   cd ngmi-slots
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env.local
   ```
   Edit `.env.local` with your specific configuration.

4. Run the Sui setup script to configure your development environment:
   ```
   pnpm sui-setup
   ```

### Deploying the Smart Contract

1. Deploy the Move contract to the Sui blockchain:
   ```
   pnpm deploy:move
   ```

2. Add the generated package ID to your `.env.local` file.

### Running the Application

Start the development server:
```
pnpm dev
```

The application will be available at http://localhost:3000.

## Game Rules

- Match 3 identical symbols on any of the 5 paylines to win
- Bet amounts range from 5 to 100 TARDI tokens
- Special symbols:
  - Multipliers (2x, 5x) increase your winnings
  - Free Spin symbols award additional spins without using tokens
  - TARDI symbol pays the highest, with a jackpot for filling the entire grid

## Smart Contract Architecture

The Move smart contract consists of several modules:

- **ngmi_slots**: Main game logic for spinning and winning
- **config**: Game configuration including symbols and payouts
- **paylines**: Definition of winning patterns
- **rng**: Secure random number generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Sui team for the blockchain platform
- T-NGMI and TARDI token community