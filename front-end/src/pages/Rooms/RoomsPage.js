import React, { Suspense, lazy } from "react";
import RoomCard from "./RoomCard";
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

const RoomsHeader = lazy(() => import("./RoomsHeader"));

function RoomsPage() {
  return (
    <>
      <Suspense fallback={<div>Loading header...</div>}>
        <RoomsHeader />
      </Suspense>

      <div className="extra-margin-top">
        <div className="mb-5">
          <RoomCard
            title="Junior Room"
            capacity="1-2 PERSONS"
            size="22M2"
            description="Experience understated luxury in our Superior Double Bed Room.
Elegantly designed with a harmonious blend of comfort and style,
this space boasts a plush double bed, premium amenities, and more."
            images={[room1a, room1b]}
            link="./room1.php"
          />
        </div>

        <div className="mb-5">
          <RoomCard
            title="Deluxe Room"
            capacity="1-2 PERSONS"
            size="22M2"
            description="Experience understated luxury in our Superior Double Bed Room.
Elegantly designed with a harmonious blend of comfort and style,
this space boasts a plush double bed, premium amenities, and more."
            images={[room2a, room2b]}
            reverse
            link="./room2.php"
          />
        </div>

        <div className="mb-5">
          <RoomCard
            title="Double Room"
            capacity="1-2 PERSONS"
            size="22M2"
            description="Experience understated luxury in our Superior Double Bed Room.
Elegantly designed with a harmonious blend of comfort and style,
this space boasts a plush double bed, premium amenit"
            images={[room3a, room3b]}
            link="./room3.php"
          />
        </div>

        <div className="mb-5">
          <RoomCard
            title="Twin Room"
            capacity="1-2 PERSONS"
            size="30M2"
            description="Experience understated luxury in our Superior Double Bed Room.
Elegantly designed with a harmonious blend of comfort and style,
this space boasts a plush double bed, premium amenities, and more."
            images={[room4a, room4b]}
            reverse
            link="./room4.php"
          />
        </div>

        <div className="mb-5">
          <RoomCard
            title="Superior Twin Room"
            capacity="2-3 PERSONS"
            size="28M2"
            description="Experience understated luxury in our Superior Double Bed Room.
Elegantly designed with a harmonious blend of comfort and style,
this space boasts a plush double bed, premium amenities, and more."
            images={[room5a, room5b]}
            link="./room5.php"
          />
        </div>
      </div>
    </>
  );
}

export default RoomsPage;
