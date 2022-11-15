import React from 'react';
import { Tabs, DesktopWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import Chart from 'Components/chart';
import ReactJoyride from 'react-joyride';
import classNames from 'classnames';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import {
    DBOT_ONBOARDING,
    handleJoyrideCallback,
    getTourSettings,
    setTourType,
    tour_type,
    tour_status_ended,
} from './joyride-config';
import DashboardComponent from './dashboard-component';
import RunStrategy from './dashboard-component/run-strategy';
import RunPanel from '../run-panel';
import QuickStrategy from './quick-strategy';
import Tutorial from './tutorial-tab';
import TourTriggrerDialog from './tour-trigger-dialog';

type TDashboard = {
    active_tab: number;
    is_drawer_open: boolean;
    is_tour_dialog_visible: boolean;
    has_file_loaded: boolean;
    has_tour_started: boolean;
    has_onboard_tour_started: boolean;
    has_bot_builder_tour_started: boolean;
    onEntered: () => void;
    setActiveTab: (active_tab: number) => void;
    setTourActive: (param: boolean) => void;
    setBotBuilderTourState: (param: boolean) => void;
    setOnBoardTourRunState: (param: boolean) => void;
    setTourDialogVisibility: (param: boolean) => void;
    setIsTourEnded: (param: boolean) => void;
    toggleStrategyModal: () => void;
};

const Dashboard = ({
    active_tab,
    has_tour_started,
    has_file_loaded,
    has_onboard_tour_started,
    is_drawer_open,
    is_tour_dialog_visible,
    onEntered,
    setActiveTab,
    setTourActive,
    setOnBoardTourRunState,
    setBotBuilderTourState,
    setTourDialogVisibility,
    setIsTourEnded,
    toggleStrategyModal,
}: TDashboard) => {
    const [is_tour_running, setTourRun] = React.useState<boolean>(true);
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setTourRun(true);
        toggleStrategyModal();
    };

    let tour_status: { [key: string]: string };
    const setTourStatus = (param: { [key: string]: string }) => {
        if (tour_status) {
            const { action } = tour_status;
            let actions = ['skip', 'close'];

            if (tour_type.key === 'bot_builder_') {
                actions = ['skip', 'close'];
            }
            if (actions.includes(action)) {
                if (tour_type.key === 'bot_builder_') {
                    setBotBuilderTourState(false);
                } else {
                    setOnBoardTourRunState(false);
                }
                setTourActive(false);
            }
        }
    };
    let tour_ended = false;
    React.useEffect(() => {
        if (active_tab === 0 && has_file_loaded) {
            onEntered();
        }
        if (active_tab === 1 && !has_onboard_tour_started) {
            setTourType('bot_builder_');
            setTourDialogVisibility(true);
        }

        tour_status = getTourSettings('onboard_tour_status');
        setTourStatus(tour_status);
    }, [active_tab, handleJoyrideCallback, has_onboard_tour_started, tour_ended]);

    //TODO: added addeventlistner because the useeffect does not trigger
    window.addEventListener('storage', () => {
        tour_status = getTourSettings('bot_builder_status');
        setTourStatus(tour_status);
        if (tour_status_ended.key === 'finished') {
            tour_ended = true;
        }

        if (tour_ended) {
            setTourDialogVisibility(true);
            setIsTourEnded(true);
        }
    });

    return (
        <React.Fragment>
            <div className='dashboard__main'>
                <div className='dashboard__container'>
                    {active_tab === 0 && <TourTriggrerDialog />}
                    {active_tab === 1 && !is_tour_dialog_visible && <TourTriggrerDialog />}
                    {has_tour_started && (
                        <ReactJoyride
                            steps={DBOT_ONBOARDING}
                            run={is_tour_running}
                            continuous
                            callback={handleJoyrideCallback}
                            spotlightClicks
                        />
                    )}
                    <Tabs active_index={active_tab} className='dashboard__tabs' onTabItemClick={setActiveTab} top>
                        <div icon='IcDashboardComponentTab' label={localize('Dashboard')}>
                            <DashboardComponent />
                        </div>
                        <div icon='IcBotBuilderTabIcon' label={localize('Bot Builder')} id='id-bot-builder' />
                        <div
                            icon='IcQuickStrategyIcon'
                            label={localize('Quick Strategy')}
                            id='id-quick-strategy'
                            onClick={handleClick}
                        >
                            <div
                                className={classNames('quick-strategy', {
                                    'quick-strategy__notifications-container--open': is_drawer_open,
                                    'quick-strategy__notifications-container--closed': !is_drawer_open,
                                })}
                            >
                                <QuickStrategy />
                            </div>
                        </div>
                        <div icon='IcChartsTabDbot' label={localize('Charts')} id='id-charts'>
                            <Chart />
                        </div>
                        <div icon='IcTutorialsTabs' label={localize('Tutorial')} id='id-tutorials'>
                            <div className='tutorials-wrapper'>
                                <Tutorial />
                            </div>
                        </div>
                    </Tabs>
                </div>
            </div>
            <DesktopWrapper>
                <div className='dashboard__run-strategy-wrapper'>
                    <RunStrategy />

                    {/*
                        TODO: need to add named tab index such as 'dashboard', 'charts' etc
                        instead of using default index 0, 1, 2
                        
                        1. Bot-Builder
                        2. Quick Strategy
                        3. Charts
                    */}
                    {[1, 2, 3].includes(active_tab) && <RunPanel />}
                </div>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default connect(({ dashboard, quick_strategy, run_panel, load_modal }: RootStore) => ({
    active_tab: dashboard.active_tab,
    is_drawer_open: run_panel.is_drawer_open,
    is_tour_dialog_visible: dashboard.is_tour_dialog_visible,
    setActiveTab: dashboard.setActiveTab,
    toggleStrategyModal: quick_strategy.toggleStrategyModal,
    onEntered: load_modal.onEntered,
    has_bot_builder_tour_started: dashboard.has_bot_builder_tour_started,
    has_file_loaded: dashboard.has_file_loaded,
    has_onboard_tour_started: dashboard.has_onboard_tour_started,
    has_tour_started: dashboard.has_tour_started,
    setTourActive: dashboard.setTourActive,
    setOnBoardTourRunState: dashboard.setOnBoardTourRunState,
    setTourDialogVisibility: dashboard.setTourDialogVisibility,
    setBotBuilderTourState: dashboard.setBotBuilderTourState,
    setIsTourEnded: dashboard.setIsTourEnded,
}))(Dashboard);
