// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/pie
import { Pie } from '@nivo/pie'
import { animated } from '@react-spring/web'
const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0
    dataWithArc.forEach(datum => {
        total += datum.value
    })

    return (
        <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
                fontSize: '52px',
                fontWeight: 600,
                color: '#E6E3D9 !important'
            }}
        >
            {total}
        </text>
    )
}

const TwoColorPie = ({ data /* see data tab */ }) => (
    <Pie
        data={data}
        layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenteredMetric]}
        margin={{ top: 40, right: 85, bottom: 40, left: 100 }}
        innerRadius={0.5}
        padAngle={0.7}
        width={500}
        height={500}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
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
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#fff"
        arcLinkLabelsThickness={2}
        arcLinkLabelsDiagonalLength={10}
        arcLinkLabelsTextOffset={3}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsComponent={({ datum, label, style }) => (
            <animated.g transform={style.transform} style={{ pointerEvents: 'none' }}>
                <circle fill={style.textColor} cy={6} r={15} />
                <circle fill="#ffffff" stroke={datum.color} strokeWidth={2} r={16} />
                <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={style.textColor}
                    style={{
                        fontSize: 10,
                        fontWeight: 800,
                    }}
                >
                    {label}
                </text>
            </animated.g>
        )}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
    />
)

export default TwoColorPie