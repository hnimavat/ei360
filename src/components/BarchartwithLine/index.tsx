import React from "react";
import type { BarchartwithLineProps } from './BarchartwithLineProps.js';
import { VerticalBarChart, ILegendsProps} from '@fluentui/react-charting';

// BarchartwithLine States.
export interface BarchartwithLineState {
    parentWidth: number;
    useSingleColor: boolean
}

class BarchartwithLine extends React.Component<BarchartwithLineProps, BarchartwithLineState, {}> {
private parentRef: React.RefObject<HTMLDivElement>; 

constructor(props: BarchartwithLineProps){
    super(props);
    
    this.parentRef = React.createRef();

    this.state = {
      parentWidth: 0,
      useSingleColor: true
    }
 }

 componentDidMount() {
    this.setState({
      parentWidth: this.parentRef.current?.offsetWidth || 0,
    });
  }

  // Ensure the chart updates when the window is resized
  handleResize = () => {
    this.setState({
      parentWidth: this.parentRef.current?.offsetWidth || 0,
    });
  };

  componentDidUpdate() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

 public render(): React.ReactElement<BarchartwithLineProps> {
    const { data } = this.props;
    const points = data.chartData;    
    const customColors = data.chartLineColors;
    const lineLegendColor = data.chartLineLegendColor;

    const legendStyles: Partial<ILegendsProps> = {
      styles : {
        rect : {
          width : 30,            
        },
        text : {
          fontFamily : 'Poppins',
          fontSize : '12px',
          color : '#74788D',
          fontWeight : '500'
        }
      },
      centerLegends: true 
    }

    return (
        <>
           <div id="BarchartwithLineWrap" ref={this.parentRef}>
                <VerticalBarChart                    
                    data={points}
                    width={this.state.parentWidth}
                    height={this.state.parentWidth/2}
                    barWidth={20}
                    useSingleColor={this.state.useSingleColor}                
                    yAxisTickCount={6}
                    colors={customColors}
                    lineLegendColor={lineLegendColor}
                    hideLegend={true}
                    hideLabels={true}
                    enableReflow={true}
                    legendProps={legendStyles}
                />
            </div>
        </>
    )
 }
}

export default BarchartwithLine;