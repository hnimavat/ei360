import * as React from 'react';
import styles from './EiAccountsTiles.module.scss';
import type { IEiAccountsTilesProps } from './IEiAccountsTilesProps';
import '../../common.css';
import { Link } from '@fluentui/react';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";

interface SeparatorProps {
  turns: number;
  style: React.CSSProperties;
}

class Separator extends React.Component<SeparatorProps> {
  render() {
    const { turns, style } = this.props;
    return (
      <div
        style={{
          position: "absolute",
          height: "101%",
          transform: `rotate(${turns}turn)`,
          overflow: "hidden"
        }}
      >
        <div style={style} />
      </div>
    );
  }
}

interface RadialSeparatorsProps {
  count: number;
  style: React.CSSProperties;
}

class RadialSeparators extends React.Component<RadialSeparatorsProps> {
  render() {
    const { count, style } = this.props;
    const turns = 1 / count;
    return [...Array(count).keys()].map(index => (
      <Separator key={index} turns={index * turns} style={style} />
    ));
  }
}

export default class EiAccountsTiles extends React.Component<IEiAccountsTilesProps, {}> {
  public render(): React.ReactElement<IEiAccountsTilesProps> {
    const CardListing = [
      {
        id : "1",
        name: "Accounts",
        value: "4",
        duration: "",
        image: "",
        url: " https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Accounts.aspx ",
      }, 
      {
        id : "2",
        name: "Programs/Projects",
        value: "24",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Programs_Projects.aspx",
      },
      {
        id : "3",
        name: "Revenue($)",
        value: "5.3M",
        duration: "Yearly",
        image: require('../assets/revenue.png'),
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Revenue($).aspx",
      },
      {
        id : "4",
        name: "MSA/SOW/POs Due",
        value: "3",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/MSA_Due.aspx",
      },
      {
        id : "5",
        name: "MSA/SOW/POs Overdue",
        value: "2",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/MSA_Overdue.aspx",
      },
      {
        id : "5",
        name: "Customer POCs",
        value: "5",
        duration: "",
        image: "",
        url: "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Customers_POCs.aspx"
      }
    ]

    return (
      <section className={`cardSection ${styles.cardWrapper}`}>
        <div className="i-row">
          {
            CardListing.map((item, index) => {
              return (
                  <div key={item.id} className='i-col-2'>
                    <Link className="card_border_skyblue" href={item.url}>
                      {item.duration && <span className='card_tag'>{item.duration}</span>}
                      <div className='header_card'>
                        <div className='title'>{item.name}</div>
                      </div>
                      <div className='body_card'> 
                        <div className='title_value'>{item.value}</div>
                        {
                          item.image &&  
                          <div className='title_value_chart'>
                            <div style={{ width: 45 }}>
                              <CircularProgressbarWithChildren
                                value={60}
                                text={`60%`}
                                strokeWidth={8}
                                circleRatio={0.75}
                                styles={{
                                  path: {
                                    stroke: '#F57D0E',
                                    strokeLinecap: 'square',
                                    transform: 'rotate(-135deg)',
                                    transformOrigin: 'center center',
                                  },
                                  trail: {
                                    // Trail color
                                    stroke: '#EFF2F7',
                                    strokeLinecap: 'square',
                                    transform: 'rotate(-135deg)',
                                    transformOrigin: 'center center',
                                  },
                                  // Customize the text
                                  text: {
                                    fill: '#F8F8FB',
                                    fontSize: '22px',
                                    fontFamily: 'Poppins',
                                    fontWeight: 600
                                  }
                                }} >
                                <RadialSeparators
                                  count={24}
                                  style={{
                                    background: "#004e8c",
                                    width: "2px",
                                    // This needs to be equal to props.strokeWidth
                                    height: `${10}%`
                                  }}
                                />
                              </CircularProgressbarWithChildren>
                            </div>
                          </div>
                        }
                      </div>
                    </Link>
                  </div>  
              )
            })
          }
        </div>
      </section>
    );
  }
}
