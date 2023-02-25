// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/pie
import { color } from '@mui/system'
import { ResponsivePie } from '@nivo/pie'
import { animated } from '@react-spring/web'

const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0
    let paid = 0
    dataWithArc.forEach((datum, i) => {
        total += datum.value
        if(i === 0){
            paid += datum.value
        }
        
    })

    let per = paid / total * 100

    return (
        <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            fill='white'
            opacity={0.75}
            style={{
                fontSize: '40px',
                fontWeight: 600,
                color: '#FFFFFF !important'
            }}
        >
            {per.toFixed(1)}%
        </text>
    )
}

const TwoColorPie = ({ data /* see data tab */ }) => (
    <ResponsivePie
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.75}
        padAngle={5}
        //width={300}
        //height={300}
        cornerRadius={3}
        theme={{
            textColor: 'white'
        }}
        
        enableArcLabels={false}
        arcLinkLabel={d => `${d.id} (${d.formattedValue})`}
        arcLinkLabelsColor="#fff"
        layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenteredMetric]}
        borderWidth={1}
        colors={{ datum: 'data.color' }}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.2
                ]
            ]
        }}
        tooltip={({ datum: { id, value, percentage, color } }) => (
            <div
                style={{
                    padding: 12,
                    color,
                    background: '#222222',
                    borderRadius: 10,
                }}
            >
                <strong>
                    {id}: {value}
                </strong>
            </div>
        )}
        enableArcLinkLabels={false}
    />
)

export default TwoColorPie