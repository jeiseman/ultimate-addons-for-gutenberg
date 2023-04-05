import { useEffect, useState, useRef } from '@wordpress/element';
import addBlockEditorDynamicStyles from '@Controls/addBlockEditorDynamicStyles';
import styling from './styling';
import Settings from './settings';
import Render from './render';
import { getSettings as getDateSettings } from '@wordpress/date';
import responsiveConditionPreview from '@Controls/responsiveConditionPreview';
import { useDeviceType } from '@Controls/getPreviewType';
import { applyFilters } from '@wordpress/hooks';
import WebfontLoader from '@Components/typography/fontloader';

//  Import CSS.
import './style.scss';


const UAGBCountdownEdit = ( props ) => {

	const {
		isSelected,
		clientId,
		attributes,
		attributes: {
			block_id,
			timeModified,
			endDateTime,
			showDays,
			showHours,
			showMinutes,
			UAGHideDesktop,
			UAGHideTab,
			UAGHideMob,
			digitLoadGoogleFonts,
			digitFontFamily,
			digitFontWeight,
			labelLoadGoogleFonts,
			labelFontFamily,
			labelFontWeight,
			separatorLoadGoogleFonts,
			separatorFontFamily,
			separatorFontWeight,
		},
		setAttributes
	} = props;

	const [ timeChanged, setTimeChanged ] = useState( 0 );

	const deviceType = useDeviceType();

	useEffect( () => {

		// Dynamically set default value to Jan 1 of next year (UTC),
		// on drag and drop of a new instance of the block. 
		if( ! timeModified ) {  // check if time has been modified dynamically using the flag attribute.

			// Get WordPress' timezone offset from settings.
			const { timezone } = getDateSettings();

			// For countdown calculations.
			const actualTime = new Date();

			// For setting the time in input fields as per selected timezone offset in WordPress settings.
			const displayTime = new Date();

			// Set the default end time to 7 days later (one for displaying in input fields, and another with actual timezone offset calculations).
			actualTime.setMilliseconds( actualTime.getMilliseconds() + ( 7 * 24 * 60 * 60 * 1000 ) );

			displayTime.setMilliseconds( displayTime.getMilliseconds() + ( 7 * 24 * 60 * 60 * 1000 ) );

			// For display time, we consider local and WP timezone offset.
			displayTime.setMilliseconds( displayTime.getMilliseconds() + ( ( displayTime.getTimezoneOffset() * 60 * 1000 ) + ( timezone.offset * 60 * 60 * 1000 ) ) );
	
			setAttributes( {
				endDateTime: actualTime,
				endDateTimeCopy: actualTime,
				displayEndDateTime: displayTime,
				timeModified: true,
			} );
		}

		// editorInnerblocksPreview: This attribute is used to display innerblocks preview for 'Replace with Content' mode.
		// block_id: Assigning block_id in the attribute.
		setAttributes( {
			editorInnerblocksPreview: false,
			block_id: clientId.substr( 0, 8 ),
		} );
	}, [] );

	const countdownRef = useRef( null );

	useEffect( () => {
		if( countdownRef ) {
		setTimeout( () => {
			UAGBCountdown.editorInit( '.uagb-block-' + clientId.substr( 0, 8 ), attributes, countdownRef.current ); // eslint-disable-line no-undef
		} )
		}
	}, [ countdownRef ] );

	useEffect( () => {
		// Replacement for componentDidUpdate.
		const blockStyling = styling( props );

		addBlockEditorDynamicStyles( 'uagb-countdown-style-' + clientId.substr( 0, 8 ), blockStyling );
	}, [ attributes, deviceType ] );

	useEffect( () => {
		if( block_id && timeChanged === 1 ) {
			UAGBCountdown.changeEndTime( '.uagb-block-' + block_id, attributes, countdownRef.current ) // eslint-disable-line no-undef
		}
		setTimeChanged( 1 );
	}, [
		endDateTime,
		showDays,
		showHours,
		showMinutes,
	] )

	useEffect( () => {

		responsiveConditionPreview( props );

	}, [
		UAGHideDesktop,
		UAGHideTab,
		UAGHideMob,
		deviceType
	] );

	// Load all the Google Fonts for The Countdown Block.
	let loadDigitGoogleFonts;
	let loadLabelGoogleFonts;
	let loadSeparatorGoogleFonts;

	if ( digitLoadGoogleFonts === true ) {
		const digitConfig = {
			google: {
				families: [
					digitFontFamily +
						( digitFontWeight ? ':' + digitFontWeight : '' ),
				],
			},
		};
		loadDigitGoogleFonts = (
			<WebfontLoader config={ digitConfig }></WebfontLoader>
		);
	}

	if ( labelLoadGoogleFonts === true ) {
		const labelConfig = {
			google: {
				families: [
					labelFontFamily + ( labelFontWeight ? ':' + labelFontWeight : '' ),
				],
			},
		};
		loadLabelGoogleFonts = (
			<WebfontLoader config={ labelConfig }></WebfontLoader>
		);
	}

	if ( separatorLoadGoogleFonts === true ) {
		const separatorConfig = {
			google: {
				families: [
					separatorFontFamily +
						( separatorFontWeight ? ':' + separatorFontWeight : '' ),
				],
			},
		};
		loadSeparatorGoogleFonts = (
			<WebfontLoader config={ separatorConfig }></WebfontLoader>
		);
	}

	// Hooks cannot be applied within conditional renders, so we pre-fetch the value.
	const countdownToolbar = applyFilters( 'spectra.countdown.toolbar-hook', '', props.name );

	return (
		<>
			{/* Countdown Toolbar options for Pro (Replace feature) */}
			{ ( props.attributes.timerEndAction === 'content' ) &&
				countdownToolbar
			}
			{ isSelected && <Settings parentProps={ props } /> }
			<Render countdownRef={ countdownRef } parentProps={ props } />
			{ loadDigitGoogleFonts }
			{ loadLabelGoogleFonts }
			{ loadSeparatorGoogleFonts }
		</>
	);
}

export default UAGBCountdownEdit;
