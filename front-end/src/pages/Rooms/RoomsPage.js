import React from "react";
import RoomCard from "./RoomCard";
import { Container } from "react-bootstrap";

const RoomsPage = () => {
  const rooms = [
    {
      title: "Junior Room",
      capacity: "1-2 PERSONS",
      size: "22M2",
      description:
        "Experience understated luxury in our Superior Double Bed Room. Elegantly designed with a harmonious blend of comfort and style, this space boasts a plush double bed, premium amenities, and more.",
      images: ["imgs/dhoma1.jpeg", "imgs/slider5.jpeg"],
      link: "./room3.php",
    },
    {
      title: "Deluxe Room",
      capacity: "1-2 PERSONS",
      size: "22M2",
      description:
        "Experience understated luxury in our Superior Double Bed Room. Elegantly designed with a harmonious blend of comfort and style, this space boasts a plush double bed, premium amenities, and more.",
      images: ["imgs/dhoma22.jpeg", "imgs/slider4.webp"],
      link: "./room2.php",
    },
    {
      title: "Double Room",
      capacity: "1-2 PERSONS",
      size: "22M2",
      description:
        "Experience understated luxury in our Superior Double Bed Room. Elegantly designed with a harmonious blend of comfort and style, this space boasts a plush double bed, premium amenities.",
      images: ["imgs/dhoma1.jpeg", "imgs/slider3.jpeg"],
      link: "./room1.php",
    },
    {
      title: "Twin Room",
      capacity: "1-2 PERSONS",
      size: "22M2",
      description:
        "Experience understated luxury in our Superior Double Bed Room. Elegantly designed with a harmonious blend of comfort and style, this space boasts a plush double bed, premium amenities, and more.",
      images: ["imgs/woden.jpeg", "imgs/junior3.jpg"],
      link: "./room4.php",
    },
    {
      title: "Superior Twin Room",
      capacity: "1-2 PERSONS",
      size: "22M2",
      description:
        "Experience understated luxury in our Superior Double Bed Room. Elegantly designed with a harmonious blend of comfort and style, this space boasts a plush double bed, premium amenities, and more.",
      images: ["imgs/supertwin.jpg", "imgs/slider6.jpeg"],
      link: "./room5.php",
    },
  ];

  return (
    <>
      <Container className="my-5">
        <h2 className="text-center mb-4">Welcome to our exquisite hotel rooms!</h2>
        {rooms.map((room, index) => (
          <RoomCard key={index} {...room} isReversed={index % 2 === 1} />
        ))}
      </Container>

    </>
  );
};

export default RoomsPage;
