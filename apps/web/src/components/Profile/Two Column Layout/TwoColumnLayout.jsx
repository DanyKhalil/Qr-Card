import React from 'react';
import './TwoColumnLayout.css';
import TitleAndLinks from '../Title With Links/TitleAndLinks';
import DescriptionText from '../Description Text/DescriptionText';
import YoutubePreview from '../Youtube Preview/YoutubePreview';
import YoutubeVideos from '../Youtube Videos/YoutubeVideos';
import AddressCard from '../Address Card/AddressCard';
import Locations from '../Locations/Locations';
import ProfileQrCode from '../Qr Code/ProfileQrCode';
import CustomContentDisplay from '../CustomContentDisplay/CustomContentDisplay';

const TwoColumnLayout = ({ 
    className = "",
    gap = "0px",
    contactLinks = [{name: "@dany-khalil", iconName: "instagram"},{name: "71 239 110", iconName: "phone"}],
    connectLinks = [{name: "@dany-khalil", iconName: "instagram"},{name: "71 239 110", iconName: "phone"}],
    websiteLink = [{name:"www.dany.com", iconName:"web"}],
    bio = "Hello HelloHello ...",
    userName = "John Doe",
    videos = [],
    locations = [],
    id = "User001",
    customContent,
    QrCodeColor = "#6366f1", // Updated from white to muted indigo/purple
    profilePic,
    includeProfilePic,
    includeContact,
    includeSocialMedia,
    includeWebsite,
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

    const profileUrlForQrCode = `${window.location.origin}/profile/${id}?qrScan=true`;

    const getToken = () => localStorage.getItem("token");
    const getCurrentUser = () => {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    };
    
    return (
        <div className={`two-column-layout ${className}`}>
            <div className="column left-column">
                <TitleAndLinks title="Contact" links={contactLinks}/>
                <TitleAndLinks title="Connect" links={formatSocialLinks(connectLinks)}/>
                <TitleAndLinks title="Website" links={[{name:websiteLink, iconName:"web"}].filter(link => link.name && String(link.name).trim() !== '')}/>
                {id===getCurrentUser()?.id && (<ProfileQrCode 
                    profileUrl={profileUrlForQrCode} 
                    color={QrCodeColor}
                    name={userName}
                    userLinks={
                                (includeContact ? contactLinks : []).concat(
                                    (includeSocialMedia ? formatSocialLinks(connectLinks) : [])).concat(
                                        (includeWebsite ? [{name:websiteLink, iconName:"web"}].filter(link => link.name && String(link.name).trim() !== '') : [])
                                )}
                    image={includeProfilePic ? profilePic : null}
                />)}
            </div>
            
            <div 
                className="separator"
                style={{
                    width: "5px",
                    backgroundColor: "#6366f1", // Updated separator color
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


                <div>
                    {customContent.map((content) => (
                        <CustomContentDisplay key={content.id} customContent={content} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TwoColumnLayout;
