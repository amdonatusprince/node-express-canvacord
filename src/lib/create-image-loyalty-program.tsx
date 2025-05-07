import { Builder, Font, FontFactory } from 'canvacord'

interface LoyaltyProgramData {
  name: string
  collectionAddress: string
  numMinted: number
  tiers: Array<{
    name: string
    xpRequired: number
    rewards: string[]
  }>
  pointsPerAction: {
    [key: string]: number
  }
  metadata: {
    organizationName: string
    brandColor?: string
  }
}

class CreateImageLoyaltyProgram extends Builder {
  constructor(
    private readonly vars: {
      data: LoyaltyProgramData
    },
  ) {
    super(800, 600)
    if (!FontFactory.size) Font.loadDefault()
  }

  private getGradientColors(brandColor: string): string[] {
    const r = parseInt(brandColor.slice(1, 3), 16)
    const g = parseInt(brandColor.slice(3, 5), 16)
    const b = parseInt(brandColor.slice(5, 7), 16)
    
    const lighter = `rgb(${Math.min(r + 40, 255)}, ${Math.min(g + 40, 255)}, ${Math.min(b + 40, 255)})`
    const darker = `rgb(${Math.max(r - 40, 0)}, ${Math.max(g - 40, 0)}, ${Math.max(b - 40, 0)})`
    
    return [lighter, brandColor, darker]
  }

  async render() {
    const { data } = this.vars
    const colors = this.getGradientColors(data.metadata.brandColor || '#8aec25')

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          color: '#333',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <div style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60%',
          height: '100%',
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
          opacity: 0.1,
          transform: 'skewX(-15deg)',
          zIndex: 0
        }} />

        {/* Content */}
        <div style={{ 
          display: 'flex', 
          position: 'relative', 
          zIndex: 1, 
          flexDirection: 'column', 
          flex: 1,
          width: '100%'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '100%' }}>
            <h1 style={{ fontSize: '32px', margin: 0, color: colors[1] }}>{data.metadata.organizationName}</h1>
            <div style={{ 
              display: 'flex',
              background: colors[1],
              color: 'white',
              padding: '8px 16px', 
              borderRadius: '20px',
              fontSize: '18px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}>
              {data.numMinted} Members
            </div>
          </div>

          {/* Program Name */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            marginBottom: '30px',
            width: '100%'
          }}>
            <h2 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#444' }}>{data.name}</h2>
            <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
              {data.collectionAddress.slice(0, 6)}...{data.collectionAddress.slice(-6)}
            </p>
          </div>

          {/* Points System */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            marginBottom: '30px',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '20px', margin: '0 0 15px 0', color: '#444' }}>Points System</h3>
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
              {Object.entries(data.pointsPerAction).map(([action, points]) => (
                <div key={action} style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'white',
                  padding: '15px',
                  borderRadius: '10px',
                  flex: 1,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  border: `1px solid ${colors[0]}`
                }}>
                  <span style={{ fontSize: '16px', textTransform: 'capitalize', color: '#666' }}>{action}</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: colors[1] }}>{points} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tiers */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '20px', margin: '0 0 15px 0', color: '#444' }}>Reward Tiers</h3>
            <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
              {data.tiers.map((tier, index) => (
                <div key={tier.name} style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'white',
                  padding: '15px',
                  borderRadius: '10px',
                  flex: 1,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  border: `1px solid ${colors[0]}`
                }}>
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    width: '100%'
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: colors[1] }}>{tier.name}</span>
                    <span style={{ fontSize: '14px', color: '#666' }}>{tier.xpRequired} XP</span>
                  </div>
                  <ul style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 0,
                    padding: '0 0 0 20px',
                    fontSize: '14px',
                    color: '#666',
                    width: '100%'
                  }}>
                    {tier.rewards.map((reward, i) => (
                      <li key={i} style={{ display: 'flex' }}>{reward}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export async function createImageLoyaltyProgram(data: LoyaltyProgramData): Promise<Buffer> {
  const generator = new CreateImageLoyaltyProgram({ data })
  return (await generator.build({ format: 'png' })) as Buffer
} 