import { useAtom } from "jotai";
import { userAtom } from "../store/authStore";
import SearchBar from "../components/searchbar.tsx";
export default function SearchPage() {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);

    fetch(`http://localhost:5000/search/book/${query}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    fetch(`http://localhost:5000/search/music?query=${query}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    fetch(`http://localhost:5000/search/game?query=${query}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    fetch(`http://localhost:5000/search/movie?query=${query}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));

    fetch(`http://localhost:5000/search/images?query=${query}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };
  return (
    <div className="p-6">
      <SearchBar onSearch={handleSearch} placeholder="Search books..." />
    </div>
  );
}
