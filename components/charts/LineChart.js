// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/pie
import { ResponsiveLine } from '@nivo/line'
import { animated } from '@react-spring/web'

//function
import formatMoney from '../utils/functions/formatMoney'

const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
    <g>
        <circle fill="#fff" r={size / 2} strokeWidth={borderWidth} stroke={borderColor} />
        <circle
            r={size / 5}
            strokeWidth={borderWidth}
            stroke={borderColor}
            fill={color}
            fillOpacity={0.35}
        />
    </g>
)

const LineChart = ({ data /* see data tab */ }) => (
    <ResponsiveLine
        width={850}
        height={300}
        margin={{top: 20, right: 20, bottom: 60, left: 60 }}
        colors={{datum: 'color'}}
        data={data}
        animate={true}
        enableSlices={'x'}
        enableArea={true}
        areaOpacity={0.15}
        enableGridX={false}
        enableGridY={false}
        pointLabel={false}
        theme={{
            "textColor": "#fff",
            "axis": {
                "domain": {
                    "line": {
                        "stroke": "#fff"
                    }
                }
            }
        }}
        sliceTooltip={({slice}) => {
            return (
                <div
                    style={{
                        background: 'white',
                        padding: '9px 12px',
                        border: '1px solid #ccc',
                    }}
                >
                    <div
                            style={{
                                padding: '3px 0',
                                color: '#1F2122'
                            }}
                        >
                            Renta neta: <strong>{formatMoney(slice.points[0].data.y)}</strong>
                        </div>
                </div>
            )
        }}
        
        
        xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            useUTC: false,
            precision: 'day',
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
            type: 'linear',
            stacked: false
        }}
        axisLeft={{
            legendOffset: 12,
            color: '#fff',
        }}
        axisBottom={{
            format: '%b %y',
            tickValues: 'every month',
            legendOffset: -12,
        }}
        curve={'linear'}
        enablePointLabel={true}
        pointSymbol={CustomSymbol}
        pointSize={16}
        pointBorderWidth={1}
        pointBorderColor={{
            from: 'color',
            modifiers: [['darker', 0.3]],
        }}
        useMesh={true}
    />
)

export default LineChart