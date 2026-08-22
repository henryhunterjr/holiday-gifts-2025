import Link from "next/link";

export default function Home() {
  return (
    <p>
      The gift guide lives at <Link href="/gifts/">/gifts</Link>.
    </p>
  );
}
