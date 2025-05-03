// The JSX pragma tells transpiler how to transform JSX into the equivalent JavaScript code

// import Canvacord
// Builder = The base class for creating custom builders
// JSX = The JSX pragma for creating elements
// Font = The Font class for loading custom fonts
// FontFactory = The FontFactory for managing fonts
import { Builder, Font, FontFactory } from 'canvacord'

// define a builder
class CreateImageSolanaBalance extends Builder {
  constructor(
    private readonly vars: {
      address: string
      balance: string
    },
  ) {
    // set the size of the image
    super(300, 300)

    // if no fonts are loaded, load the default font
    if (!FontFactory.size) Font.loadDefault()
  }

  async render() {
    // declare the shape of the image
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
        }}
      >
        <p>Balance: ${this.vars.balance}!</p>
        <p>
          Address: {this.vars.address.slice(0, 6)}...{this.vars.address.slice(-6)}
        </p>
      </div>
    )
  }
}

export async function createImageSolanaBalance({
  address,
  balance,
}: {
  address: string
  balance: string
}): Promise<Buffer> {
  const generator = new CreateImageSolanaBalance({ address, balance })

  return (await generator.build({ format: 'png' })) as Buffer
}
