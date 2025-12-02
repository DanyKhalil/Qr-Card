import React from 'react';
import './TwoColumnLayout.css';
import TitleAndLinks from "../Title With Links/TitleAndLinks"
import DescriptionText from '../../Profile/Description Text/DescriptionText';
import YoutubePreview from '../../Profile/Youtube Preview/YoutubePreview';
import YoutubeVideos from '../Youtube Videos/YoutubeVideos';
import AddressCard from '../../Profile/Address Card/AddressCard';
import Locations from '../../Profile/Locations/Locations';
import ProfileQrCode from '../../Profile/Qr Code/ProfileQrCode';
import TitleAndFields from '../Title With Fields/TitleAndFields';
import LabelWithTextArea from '../Label With Text Area/LabelWithTextArea';
import YouTubeCard from '../Youtube Card/YoutubeCard';
import AddressCards from '../Address Cards/AddressCards';
import CustomContentSection from '../CustomContentSection/CustomContentSection';

const TwoColumnLayout = ({ 
    className = "",
    gap = "0px",
    headline = "",
    personalInformationFields = [],
    connectLinks = [{name: "@dany-khalil", iconName: "instagram"},{name: "71 239 110", iconName: "phone"}],
    websiteLink = [{name:"www.dany.com", iconName:"web"}],
    bio = "Hello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello",
    videos = [],
    locations = [],
    id = "User001",
    customContent=[],
    headlineSetter,
    connectLinksSetter,
    websiteLinkSetter,
    websiteLinkOnChange,
    websiteLinkOnBlur,
    websiteLinkErrorMessage,
    bioSetter,
    videosSetter,
    locationSetter,
    customContentSetter,
    QrCodeColor="#000",

    addSocialMediaModalVisibiltySetter,
    addVideoModalVisibiltySetter,
    updateVideoModalVisibiltySetter,
    videoObjectUnderUpdateSetter,
    addLocationModalVisibiltySetter,
    updateLocationModalVisibiltySetter,
    locationObjectUnderUpdateSetter
}) => {

    function formatSocialLinks(links) {
        return links.map(({ id, url }) => {
            try {
                let formattedUrl = url;
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    formattedUrl = 'https://' + url;
                }
                
                const hostname = new URL(formattedUrl).hostname.replace("www.", "");
                const icon = hostname.split(".")[0];
                const username = formattedUrl.split("/").filter(Boolean).pop();
                
                return {
                    id: id,
                    iconName: icon,
                    name: `@${username}`,
                    link: formattedUrl
                };
            } catch (error) {
                console.error("Invalid URL:", url, error);
                return null;
            }
        }).filter(Boolean);
    }

    const profileUrlForQrCode = `${window.location.origin}/profile/${id}`;

    return (
        <div className={`two-column-layout ${className}`}>
            <div className="column left-column">
                <TitleAndFields title="Personal Information" fields={personalInformationFields}/>
                <TitleAndLinks 
                    title="Social Media" 
                    links={formatSocialLinks(connectLinks)} 
                    setter={connectLinksSetter} 
                    addAction={()=>addSocialMediaModalVisibiltySetter(true)}
                />
                <ProfileQrCode profileUrl={profileUrlForQrCode} color={QrCodeColor}/>
            </div>
            
            <div 
                className="separator"
                style={{
                    width: "5px",
                    backgroundColor: "#4CAF50",
                    marginLeft: gap,
                    marginRight: gap
                }}
            />
            
            <div className="column right-column">
                <TitleAndFields title="Profile Summary" fields={[{label:"Headline", type:"text", id: "headline", value: headline, setter: headlineSetter, onChange: (e)=> headlineSetter(e.target.value)}]}/>
                <LabelWithTextArea label="Description" id="bio" value={bio} setter={bioSetter}/>
                <TitleAndFields 
                    title="Website" 
                    fields={[{label:"URL", type:"text", id: "website_url", value: websiteLink, setter:websiteLinkSetter, onChange:websiteLinkOnChange, onBlur: websiteLinkOnBlur, errorMessage: websiteLinkErrorMessage}]}
                />

                <YoutubeVideos 
                    videos={videos}
                    setter={videosSetter}
                    addAction={()=>addVideoModalVisibiltySetter(true)}
                    updateAction={()=>updateVideoModalVisibiltySetter(true)}
                    objectSetter={videoObjectUnderUpdateSetter}
                />

                <AddressCards
                    addresses={locations}
                    setter={locationSetter}
                    addAction={()=>addLocationModalVisibiltySetter(true)}
                    updateAction={()=>updateLocationModalVisibiltySetter(true)}
                    objectSetter={locationObjectUnderUpdateSetter}
                />

                <CustomContentSection
                    customContent={customContent}
                    setCustomContent={customContentSetter}
                />

            </div>
        </div>
    );
};

export default TwoColumnLayout;