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

const RoomsHeader = lazy(() => import("./RoomsHeader"));

function RoomsPage() {
  return (
    <>
      <Suspense fallback={<div>Loading header...</div>}>
        <RoomsHeader />
      </Suspense>

      <RoomCard
        title="Double Room"
        capacity="1-2 PERSONS"
        size="22M2"
        description="Understated luxury and comfort."
        images={[room1a, room1b]}
        link="./room1.php"
      />
      <RoomCard
        title="Deluxe Room"
        capacity="1-2 PERSONS"
        size="25M2"
        description="Modern, cozy, and stylish stay."
        images={[room2a, room2b]}
        reverse
        link="./room2.php"
      />
      <RoomCard
        title="Junior Suite"
        capacity="1-3 PERSONS"
        size="35M2"
        description="Elegant décor and larger living space."
        images={[room3a, room3b]}
        link="./room3.php"
      />
      <RoomCard
        title="Woden Suite"
        capacity="1-2 PERSONS"
        size="30M2"
        description="Warm ambiance with wood-style design."
        images={[room4a, room4b]}
        reverse
        link="./room4.php"
      />
      <RoomCard
        title="Super Twin"
        capacity="2-3 PERSONS"
        size="28M2"
        description="Spacious twin room with modern features."
        images={[room5a, room5b]}
        link="./room5.php"
      />
    </>
  );
}

export default RoomsPage;
