import React from 'react';
import classNames from 'classnames';
import { ProgressBarOnboarding, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { useDBotStore } from 'Stores/useDBotStore';
import { DBOT_ONBOARDING_MOBILE, TStepMobile } from '../config';
import TourButton from './common/tour-button';

const default_tour_data = {
    content: [],
    header: '',
    img: '',
    tour_step_key: 1,
};

type TTourData = TStepMobile & {
    img: string;
    tour_step_key: number;
};

const OnboardingTour = observer(() => {
    const { dashboard } = useDBotStore();
    const { onCloseTour, onTourEnd, setTourActiveStep } = dashboard;
    const [tour_step, setStep] = React.useState<number>(1);
    const [tour_data, setTourData] = React.useState<TTourData>(default_tour_data);
    const { content, header, img, media, tour_step_key } = tour_data;
    const tour_button_text = tour_step === 7 ? localize('Finish') : localize('Next');
    const steps_not_required = [1, 2];
    const test_id = tour_step_key === 7 ? 'finish-onboard-tour' : 'next-onboard-tour';

    React.useEffect(() => {
        DBOT_ONBOARDING_MOBILE.forEach(data => {
            if (data.tour_step_key === tour_step) {
                setTourData(data);
            }
            setTourActiveStep(tour_step);
        });
    }, [tour_step]);
    return (
        <div
            className={classNames('dbot-slider', {
                'dbot-slider--active': tour_step === 1,
            })}
            data-testid='onboarding-tour-mobile'
        >
            {tour_step_key !== 0 && (
                <div className='dbot-slider__navbar'>
                    <Text
                        color='less-prominent'
                        weight='less-prominent'
                        line_height='s'
                        size='xxs'
                        data-testid='dbot-onboard-slider__navbar'
                    >{`${tour_step_key}/7`}</Text>
                    <Text
                        color='prominent'
                        weight='--text-less-prominent'
                        line_height='s'
                        size='xxs'
                        onClick={onCloseTour}
                        data-testid='exit-onboard-tour'
                    >
                        {localize('Exit Tour')}
                    </Text>
                </div>
            )}
            {header && (
                <Text
                    color='prominent'
                    weight='bold'
                    align='center'
                    className='dbot-slider__title'
                    as='span'
                    line_height='s'
                    size='xs'
                >
                    {localize(header)}
                </Text>
            )}
            {media ? (
                <div className='dbot-slider__media'>
                    <video
                        autoPlay={true}
                        loop
                        controls
                        preload='auto'
                        playsInline
                        disablePictureInPicture
                        controlsList='nodownload'
                        src={media}
                    />
                </div>
            ) : (
                <div className='dbot-slider__image'>
                    <img src={img} />
                </div>
            )}

            {content && (
                <>
                    {content.map(data => {
                        return (
                            <Text
                                key={data}
                                align='center'
                                color='prominent'
                                className='dbot-slider__content'
                                as='div'
                                line_height='s'
                                size='xxs'
                            >
                                {localize(data)}
                            </Text>
                        );
                    })}
                </>
            )}
            <div className='dbot-slider__status'>
                <div className='dbot-slider__progress-bar'>
                    {/* {!steps_not_required.includes(tour_step) && (
                        <ProgressBarOnboarding
                            step={tour_step}
                            amount_of_steps={DBOT_ONBOARDING_MOBILE.map(v => v.tour_step_key.toString())}
                            setStep={setStep}
                        />
                    )} */}
                </div>
                <div className='dbot-slider__button-group'>
                    {tour_step === 1 && (
                        <TourButton
                            onClick={() => {
                                onCloseTour();
                            }}
                            label={localize('Skip')}
                            data-testid='skip-onboard-tour'
                        />
                    )}
                    {!steps_not_required.includes(tour_step) && (
                        <TourButton
                            onClick={() => {
                                setStep(tour_step - 1);
                            }}
                            label={localize('Previous')}
                            data-testid='prev-onboard-tour'
                        />
                    )}
                    <TourButton
                        type='danger'
                        onClick={() => {
                            setStep(tour_step + 1);
                            onTourEnd(tour_step, true);
                        }}
                        label={tour_button_text}
                        data-testid={test_id}
                    />
                </div>
            </div>
        </div>
    );
});

export default OnboardingTour;
