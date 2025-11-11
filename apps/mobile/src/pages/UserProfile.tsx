import { useLocalSearchParams } from 'expo-router';
import UserProfileComponent from '../components/UserProfile/UserProfile.tsx';


const mockUserData = {
    name: "Adriana Hamid Mirna Keyrouz",
    cover_photo_url: "http://192.168.0.106:5050/uploads/covers/cover-1762121904321-710563240.jpg",
    profile_pic_url: "http://192.168.0.106:5050/uploads/profiles/profile-1762121904320-95975363.jpg",
    dob: "1999-05-17",
    headline: "Technosoft Geometry Experttttttttt",
    bio: "Heating Coil, Ovoid Vessel, Weld Animationttttttttttttttt",
    phone_number: [
        "999999999"
    ],
    email: [
        "john.smit@email.com"
    ],
    social_media_links: [
        {
            id: "5f3648f8-945a-4ef0-809c-cf682315c22a",
            url: "https://www.linkedin.com/in/dany-al-khalil/",
            display_order: 0
        }
    ],
    website_link: "https://adz.comtttttttt",
    videos_links: [
        {
            id: "52f2aef2-e77e-4e36-a59a-2ee38a9ca554",
            video_url: "https://youtu.be/TKfO-ZYCTow?si=XvmKNJY_2KI3liZS",
            title: "Nidattttttttttt",
            description: "Nadoulattttttttttttt",
            display_order: 0
        }
    ],
    locations: [
        {
            id: "a16f5894-bfc7-4dfe-81b1-ed3c24de814c",
            title: "Home",
            country: "Lebanon",
            state: "",
            city: "Jounieh",
            street: "Main",
            building: "Foyer",
            floor: "3rddddddddddddddddd",
            maps_url: "",
            coordinates: null
        },
        {
            id: "dd7a5e13-a833-4304-9267-c78c5fd8e0f3",
            title: "Work",
            country: "Lebanon",
            state: "Metn",
            city: "Jisr El Bacha",
            street: "Link",
            building: "Chemaly & Chemaly",
            floor: "4th",
            maps_url: "",
            coordinates: null
        }
    ]
};

export default function UserProfilePage() {
    // const { id } = useLocalSearchParams();
    const id = 'User001';
    
    return (
        <UserProfileComponent
            {...mockUserData}
            coverPhoto = {mockUserData.cover_photo_url}
            profilePic = {mockUserData.profile_pic_url}
            id={id as string}
        />
    );
}