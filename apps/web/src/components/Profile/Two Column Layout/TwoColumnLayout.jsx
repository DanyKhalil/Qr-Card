import React from 'react';
import './TwoColumnLayout.css';
import TitleAndLinks from '../Title With Links/TitleAndLinks';
import DescriptionText from '../Description Text/DescriptionText';
import YoutubePreview from '../Youtube Preview/YoutubePreview';
import YoutubeVideos from '../Youtube Videos/YoutubeVideos';
import AddressCard from '../Address Card/AddressCard';
import Locations from '../Locations/Locations';

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
}) => {

    function formatSocialLinks(links) {
        console.log(links)
        return links.map(({ url }) => {
            try {
            const hostname = new URL(url).hostname.replace("www.", "");
            const icon = hostname.split(".")[0];
            const username = url.split("/").filter(Boolean).pop();
            console.log("URL:", icon, url);
            return {
                iconName: icon,
                name: `@${username}`
            };
            } catch (error) {
            console.error("Invalid URL:", url);
            return null;
            }
        }).filter(Boolean);
    }


    return (
        <div className={`two-column-layout ${className}`}>
            <div className="column left-column">
                <TitleAndLinks title="Contact" links={contactLinks}/>
                <TitleAndLinks title="Connect" links={formatSocialLinks(connectLinks)}/>
                <TitleAndLinks title="Website" links={websiteLink}/>
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