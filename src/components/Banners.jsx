import SephoraIcon from "./SephoraIcon";

export default function () {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <div>
        <img src="https://i.imgur.com/lhaMADj.jpg"></img>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: 95,
          }}
        >
          <SephoraIcon></SephoraIcon>
          <img src="https://i.imgur.com/d3tmwL3.png"></img>
        </div>
      </div>
    </div>
  );
}
