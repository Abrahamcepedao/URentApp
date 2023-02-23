// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/pie
import { ResponsivePie } from '@nivo/pie'
import { animated } from '@react-spring/web'

const TwoColorPie = ({ data /* see data tab */ }) => (
    <ResponsivePie
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.75}
        padAngle={0.7}
        //width={300}
        //height={300}
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
        enableArcLabels={false}
        enableArcLinkLabels={false}
    />
)

export default TwoColorPie