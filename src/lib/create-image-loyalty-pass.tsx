import { Builder, Font, FontFactory } from 'canvacord'

interface LoyaltyPassData {
  xp: number
  currentTier: string
  name: string
  owner: string
  pass: string
  metadata: {
    organizationName: string
    brandColor?: string
  }
  rewardTiers: Array<{
    name: string
    xpRequired: number
  }>
}

class CreateImageLoyaltyPass extends Builder {
  constructor(
    private readonly vars: {
      data: LoyaltyPassData
    },
  ) {
    // Set a larger size for the loyalty card
    super(800, 400)

    // Load default font if none loaded
    if (!FontFactory.size) Font.loadDefault()
  }

  private getGradientColors(brandColor: string): string[] {
    // Convert hex to RGB
    const r = parseInt(brandColor.slice(1, 3), 16)
    const g = parseInt(brandColor.slice(3, 5), 16)
    const b = parseInt(brandColor.slice(5, 7), 16)
    
    // Create lighter and darker versions
    const lighter = `rgb(${Math.min(r + 40, 255)}, ${Math.min(g + 40, 255)}, ${Math.min(b + 40, 255)})`
    const darker = `rgb(${Math.max(r - 40, 0)}, ${Math.max(g - 40, 0)}, ${Math.max(b - 40, 0)})`
    
    return [lighter, brandColor, darker]
  }

  async render() {
    const { data } = this.vars
    const colors = this.getGradientColors(data.metadata.brandColor || '#ab9f90')
    const nextTier = data.rewardTiers.find(tier => tier.xpRequired > data.xp) || data.rewardTiers[0]
    const progress = (data.xp / nextTier.xpRequired) * 100

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
              {data.currentTier} Tier
            </div>
          </div>

          {/* Card Content */}
          <div style={{ 
            display: 'flex', 
            flex: 1, 
            flexDirection: 'column', 
            justifyContent: 'center',
            width: '100%'
          }}>
            <h2 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#444' }}>{data.name}</h2>
            <p style={{ fontSize: '16px', color: '#666', margin: '0 0 20px 0' }}>
              {data.pass.slice(0, 6)}...{data.pass.slice(-6)}
            </p>

            {/* Progress Bar */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              marginBottom: '10px',
              width: '100%'
            }}>
              <div style={{ 
                display: 'flex',
                background: '#f0f0f0',
                height: '20px', 
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                width: '100%'
              }}>
                <div style={{ 
                  display: 'flex',
                  background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
                  width: `${progress}%`, 
                  height: '100%',
                  transition: 'width 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }} />
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '5px',
                fontSize: '14px',
                color: '#666',
                width: '100%'
              }}>
                <span>{data.xp} XP</span>
                <span>{nextTier.name}: {nextTier.xpRequired} XP</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: '20px',
            fontSize: '14px',
            color: '#666',
            borderTop: '1px solid #eee',
            paddingTop: '20px',
            width: '100%'
          }}>
            <span>Member since {new Date().toLocaleDateString()}</span>
            <span>ID: {data.owner.slice(0, 6)}...{data.owner.slice(-6)}</span>
          </div>
        </div>
      </div>
    )
  }
}

export async function createImageLoyaltyPass(data: LoyaltyPassData): Promise<Buffer> {
  const generator = new CreateImageLoyaltyPass({ data })
  return (await generator.build({ format: 'png' })) as Buffer
} 