import * as React from 'react';
//import styles from './EngagementDashboardOpportunitiesAverageTimeDetail.module.scss';
import type { IEngagementDashboardOpportunitiesAverageTimeDetailProps } from './IEngagementDashboardOpportunitiesAverageTimeDetailProps';
import '../../common.css';
import Piechart from '../../../components/Piechart';
import { averageFulltimeOpportunities } from '../../engagementDashboardResourcing/components/ApiData';


export default class EngagementDashboardOpportunitiesAverageTimeDetail extends React.Component<IEngagementDashboardOpportunitiesAverageTimeDetailProps, {}> {
  navigateToPreviousPage = () => {
    const currentUrl = window.location.href;
    const sourceParam = "?source=" + encodeURIComponent(currentUrl);
    window.location.href = "https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Engagement_Dashboard.aspx?menu=Engagement%20Dashboard" + sourceParam;
  };
  public render(): React.ReactElement<IEngagementDashboardOpportunitiesAverageTimeDetailProps> {
    

    return (
      <>
      <div>
        <ul className='breadcrumb'>
          <li>
          <a onClick={this.navigateToPreviousPage}>Engagement Dashboard</a>
          </li>
          <li>
          <a href="https://aixtor.sharepoint.com/sites/InfoHub360/SitePages/Opportunities.aspx">JCI - Opportunities</a>
          </li>
          <li>Average fulfilment Time</li>
        </ul>
      </div>
      <div className='i-row'>
          <div className='i-col-4'>
            <div className='i-chart-card'>
              <div className='i-card-header'>
                <div className='i-card-title'>Opportunities - BU Wise</div>
              </div>
              <div className='i-card-body'>
                <Piechart data={averageFulltimeOpportunities} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
