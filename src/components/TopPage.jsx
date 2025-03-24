import HeaderDigitalClock from "./HeaderDigitalClock";

const formatDate = () => {
  const date = new Date();
  let formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

  const exceptions = ["de", "da", "do", "das", "dos"];

  return formattedDate
    .split(" ")
    .map((word) =>
      exceptions.includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

function TopPage() {
  return (
    <div className="flex justify-between items-center gap-6">
      <h1 className="text-white text-3xl font-medium">{formatDate()}</h1>

      <div className="flex items-end">
        <HeaderDigitalClock />
      </div>
    </div>
  );
}
export default TopPage;
