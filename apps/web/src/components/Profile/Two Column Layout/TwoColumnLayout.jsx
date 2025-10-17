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
    bio = "Hello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello HelloHello HelloHello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello"
}) => {

    return (
        <div className={`two-column-layout ${className}`}>
            <div className="column left-column">
                <TitleAndLinks title="Contact" links={contactLinks}/>
                <TitleAndLinks title="Connect" links={connectLinks}/>
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
                    userName="John Doe" 
                    videos={[
                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        "https://youtu.be/video3"
                    ]}
                />

                <Locations
                    locations={[
                        {
                        title: "Main Office",
                        floor: "5th Floor",
                        building: "Tech Tower",
                        street: "123 Innovation Street",
                        city: "San Francisco",
                        state: "California",
                        country: "USA",
                        mapsLink: "https://goo.gl/maps/example1"
                        },
                        {
                        title: "Branch Office",
                        floor: "2nd Floor",
                        building: "Business Plaza",
                        street: "456 Commerce Avenue",
                        city: "New York",
                        state: "New York",
                        country: "USA",
                        mapsLink: "https://goo.gl/maps/example2"
                        },
                        {
                        title: "Warehouse",
                        street: "789 Industrial Road",
                        city: "Chicago",
                        state: "Illinois",
                        country: "USA",
                        mapsLink: "https://goo.gl/maps/example3"
                        }
                    ]}
                />

            </div>
        </div>
    );
};

export default TwoColumnLayout;