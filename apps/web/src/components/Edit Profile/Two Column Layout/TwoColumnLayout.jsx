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

const TwoColumnLayout = ({ 
    className = "",
    gap = "0px",
    headline = "",
    personalInformationFields = [],
    connectLinks = [{name: "@dany-khalil", iconName: "instagram"},{name: "71 239 110", iconName: "phone"}],
    websiteLink = [{name:"www.dany.com", iconName:"web"}],
    bio = "Hello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello",
    userName = "John Doe",
    videos = [],
    locations = [],
    id = "User001",
}) => {

    function formatSocialLinks(links) {
        return links.map(({ url }) => {
            try {
            const hostname = new URL(url).hostname.replace("www.", "");
            const icon = hostname.split(".")[0];
            const username = url.split("/").filter(Boolean).pop();
            return {
                iconName: icon,
                name: `@${username}`,
                link: url
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
                <TitleAndLinks title="Social Media" links={formatSocialLinks(connectLinks)}/>
                <ProfileQrCode profileUrl={profileUrlForQrCode}/>
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
                <TitleAndFields title="Profile Summary" fields={[{label:"Headline", id: "headline", value: headline}]}/>
                <LabelWithTextArea label="Description" id="bio" value={bio} />
                <TitleAndFields title="Website" fields={[{label:"URL", id: "website_url", value: websiteLink}]}/>

                <YoutubeVideos 
                    userName={userName} 
                    videos={videos}
                />

                <AddressCards
                    addresses={locations}
                />

            </div>
        </div>
    );
};

export default TwoColumnLayout;