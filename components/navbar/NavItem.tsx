import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavItem({
  label,
  icon,
  path,
}: {
  label: string;
  icon: string;
  path: string;
}) {
  const router = useRouter();

  const [active, setActive] = useState<boolean>();

  useEffect(() => {
    setActive(path.toLocaleLowerCase() === router.pathname.toLocaleLowerCase());
    console.log(router.pathname, path, active);
  }, [router]);

  const style = `${
    active ? 'opacity-100' : 'opacity-50'
  } w-[50px] flex flex-col gap-1 justify-center items-center`;

  return (
    <Link href={path}>
      <a className={style}>
        <span className="material-icons text-2xlxl">{icon}</span>
        <span className="label-sm">{label}</span>
      </a>
    </Link>
  );
}
