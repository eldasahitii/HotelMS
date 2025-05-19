import React from "react";
import RoomCard from "./RoomCard";
import RoomsHeader from "./RoomsHeader"; 

import room1a from "../../Assets/images/dhoma1.jpeg";
import room1b from "../../Assets/images/slider3.jpeg";
import room2a from "../../Assets/images/dhoma22.jpeg";
import room2b from "../../Assets/images/slider4.webp";
import room3a from "../../Assets/images/dhoma3.jpeg";
import room3b from "../../Assets/images/slider5.jpeg";
import room4a from "../../Assets/images/woden.jpeg";
import room4b from "../../Assets/images/junior3.jpg";
import room5a from "../../Assets/images/supertwin.jpg";
import room5b from "../../Assets/images/slider6.jpeg";

import './Rooms.css';

function RoomsPage() {
  return (
    <>
      <RoomsHeader /> 

      <div className="extra-margin-top">
        <div className="mb-5">
          <RoomCard
            id="1"
            title="Junior Room"
            capacity="1-2 PERSONS"
            size="22M2"
            price={120} 
            description="Our Junior Room is perfect for solo travelers or couples. Enjoy amenities like free Wi-Fi, a flat-screen TV, complimentary breakfast, a mini bar, and air conditioning—all in a cozy and elegant setting."
            images={[room1a, room1b]}
          />
        </div>

        <div className="mb-5">
          <RoomCard
            id="2"
            title="Deluxe Room"
            capacity="1-2 PERSONS"
            size="22M2"
            price={140}
            description="The Deluxe Room offers an elevated stay with a plush king-size bed, high-speed Wi-Fi, a coffee machine, 24-hour room service, and a luxurious en-suite bathroom with premium toiletries."
            images={[room2a, room2b]}
            reverse
          />
        </div>

        <div className="mb-5">
          <RoomCard
            id="3"
            title="Double Room"
            capacity="1-2 PERSONS"
            size="22M2"
            price={110} 
            description="This stylish Double Room includes a comfortable double bed, smart TV, workspace, wardrobe, and essentials like free Wi-Fi, air conditioning, and a safe for your valuables."
            images={[room3a, room3b]}
          />
        </div>

        <div className="mb-5">
          <RoomCard
            id="4"
            title="Twin Room"
            capacity="1-2 PERSONS"
            size="30M2"
            price={130}  
            description="Our Twin Room is ideal for friends or colleagues traveling together. Features two single beds, private bathroom, complimentary toiletries, Wi-Fi, mini fridge, and daily housekeeping."
            images={[room4a, room4b]}
            reverse
          />
        </div>

        <div className="mb-5">
          <RoomCard
            id="5"
            title="Superior Twin Room"
            capacity="2-3 PERSONS"
            size="28M2"
            price={160} 
            description="The Superior Twin Room accommodates up to three guests with two twin beds and a pull-out sofa. Includes amenities such as a minibar, room service, a flat-screen TV, and complimentary breakfast."
            images={[room5a, room5b]}
          />
        </div>
      </div>
    </>
  );
}

export default RoomsPage;
