import React from 'react';
import { Tabs, Tab } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import DashboardComponents from './dashboard-components';
import ReactJoyride from 'react-joyride';
import { DBOT_ONBOARDING } from './joyride-config';
import BotBuilder from './bot-builder';
import classNames from 'classnames';
import RunStrategy from '../toolbar/run-strategy';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import Sidebar from './dashboard-components/sidebar';
import RunPanel from '../run-panel';

interface DashboardProps {
    active_tab: number;
    setActiveTab: (active_tab: number) => void;
}

const Dashboard = ({ active_tab, setActiveTab }: DashboardProps) => {
    const [show_side_bar, setShowSideBar] = React.useState<boolean>(true);
    const [tour_run, setTourRun] = React.useState<boolean>(true);
    const handleClick = (e: any) => {
        e.preventDefault();
        setTourRun(true);
    };

    return (
        <div className='main_dashboard_container'>
            <div className={classNames('dashboard__container', { 'w-100': !show_side_bar })}>
                <div className='dashboard__run-strategy-wrapper'>
                    <RunStrategy />
                </div>
                <ReactJoyride steps={DBOT_ONBOARDING} run={tour_run} continuous={true} showProgress={true} />
                <Tabs active_index={active_tab} onTabItemClick={setActiveTab} top>
                    {/* [Todo] needs to update tabs comIcDashBoardComponentsTabponent children instead of using label property */}
                    <Tab icon='IcDashboardComponentTab' label={localize('Dashboard')}>
                        <DashboardComponents />
                    </Tab>
                    <Tab icon='IcBotbuilderTabIcon' label={localize('Bot Builder')} id='id-bot-builder'>
                        <BotBuilder />
                    </Tab>
                    <Tab
                        icon='IcQuickStrategyIcon'
                        label={localize('Quick Strategy')}
                        id='id-quick-strategy'
                        onTabItemClick={handleClick}
                    />
                    <Tab icon='IcChartsTabDbot' label={localize('Charts')} id='id-charts'>
                        <div className='dashboard__chart-wrapper'>
                            <Chart />
                        </div>
                    </Tab>
                    <Tab icon='IcTutorialsTabs' label={localize('Tutorial')} id='id-tutorials'>
                        <div>{localize('Under Developments')}</div>
                    </Tab>
                </Tabs>
            </div>
            <Sidebar is_sidebar_open={show_side_bar} setSideBarState={setShowSideBar} />
            <RunPanel />
        </div>
    );
};

export default connect((store: RootStore) => ({
    active_tab: store.dashbaord.active_tab,
    setActiveTab: store.dashbaord.setActiveTab,
}))(Dashboard);
