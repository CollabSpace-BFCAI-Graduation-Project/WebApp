"use client"
import { useTheme } from "next-themes";
import Link from "next/link";

export default function HomePage() {
  const { setTheme } = useTheme();
  return (
    <div>
      <div className="flex flex-row items-center justify-center gap-4">
        <button className="bg-yellow-500 text-white" onClick={() => setTheme("yellow")}>yellow</button>
        <button className="bg-green-500 text-white" onClick={() => setTheme("green")}>green</button>
        <button className="bg-blue-500 text-white" onClick={() => setTheme("blue")}>blue</button>
        <button className="bg-purple-500 text-white" onClick={() => setTheme("purple")}>purple</button>
        <button className="bg-pink-500 text-white" onClick={() => setTheme("pink")}>pink</button>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <Link className="font-semibold hover:underline" href="/register">register</Link>
        <Link className="font-semibold hover:underline" href="/login">login</Link>
      </div>
    </div>
  );
}
