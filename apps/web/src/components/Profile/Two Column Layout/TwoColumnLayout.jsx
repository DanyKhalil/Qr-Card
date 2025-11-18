import React from 'react';
import './TwoColumnLayout.css';
import TitleAndLinks from '../Title With Links/TitleAndLinks';
import DescriptionText from '../Description Text/DescriptionText';
import YoutubePreview from '../Youtube Preview/YoutubePreview';
import YoutubeVideos from '../Youtube Videos/YoutubeVideos';
import AddressCard from '../Address Card/AddressCard';
import Locations from '../Locations/Locations';
import ProfileQrCode from '../Qr Code/ProfileQrCode';

const TwoColumnLayout = ({ 
    className = "",
    gap = "0px",
    contactLinks = [{name: "@dany-khalil", iconName: "instagram"},{name: "71 239 110", iconName: "phone"}],
    connectLinks = [{name: "@dany-khalil", iconName: "instagram"},{name: "71 239 110", iconName: "phone"}],
    websiteLink = [{name:"www.dany.com", iconName:"web"}],
    bio = "Hello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello",
    userName = "John Doe",
    videos = [],
    locations = [],
    id = "User001",
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
                <TitleAndLinks title="Contact" links={contactLinks}/>
                <TitleAndLinks title="Connect" links={formatSocialLinks(connectLinks)}/>
                <TitleAndLinks title="Website" links={[{name:websiteLink, iconName:"web"}]}/>
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
                <DescriptionText text={bio} />
                <YoutubeVideos 
                    userName={userName} 
                    videos={videos}
                />

                <Locations
                    locations={locations}
                />

            </div>
        </div>
    );
};

export default TwoColumnLayout;