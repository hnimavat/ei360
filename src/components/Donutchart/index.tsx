import React from "react";
import {
  DonutChart,
  IChartDataPoint,
  IChartProps,
  ILegendsProps
  
} from '@fluentui/react-charting';


// Props Typescript
import type { DonutchartProps } from './DonutchartProps.js';

// Styling.
import './style.css'

// DonutChart States.
export interface DonutChartDataState {
  dynamicData: IChartDataPoint[];
  hideLabels: boolean;
  showLabelsInPercent: boolean;
  innerRadius: number;
  statusKey: number;
  statusMessage: string;
  parentWidth: number;
}

class Donutchart extends React.Component<DonutchartProps, DonutChartDataState, {}> {
  private parentRef: React.RefObject<HTMLDivElement>;




  constructor(props: DonutchartProps) {
    super(props);
    this.parentRef = React.createRef();
    this.state = {
      dynamicData: this.props.data,
      hideLabels: true,
      showLabelsInPercent: false,
      innerRadius: 95,
      statusKey: 0,
      statusMessage: '',
      parentWidth: 0, 
    };
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

  public render(): React.ReactElement<DonutchartProps> {

    const Data: IChartProps = {
      chartTitle: 'Donut chart dynamic example',
      chartData: this.state.dynamicData,
    };

    let chartDimension = {
      width: '100%',
      height: '100%'
    }

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
      centerLegends: true,
      allowFocusOnLegends: true,
    }


    return (
      <div id="DonutChartChartWrap" ref={this.parentRef}>
        <DonutChart
          data={Data}
          innerRadius={this.state.innerRadius}         
          hideLabels={this.state.hideLabels}
          showLabelsInPercent={this.state.showLabelsInPercent}
          width={this.state.parentWidth}
          height={340}         
          styles={{
            root: chartDimension,
            legendContainer:{marginBottom: 15}
          }}
          legendProps={legendStyles}
        />
      </div>
    )
  }
}

export default Donutchart;