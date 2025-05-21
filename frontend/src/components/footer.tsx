import Image from "next/image";
import Link from "next/link";

export const Footer=()=>{
return(
<footer className="pt-6 pb-8 px-10 bg-slate-900">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Logo" width={30} height={30} />
              <span className="text-lg font-bold text-slate-300 hover:text-white">TubeBridge</span>
            </div>
            <div className="flex gap-6 pl-30">
              <Link href="#" className="text-sm text-slate-300 hover:text-white">
                Terms
              </Link>
              <Link href="#" className="text-sm text-slate-300 hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-slate-300 hover:text-white">
                Contact
              </Link>
            </div>
            <div className="text-sm text-slate-300 hover:text-white">
              © {new Date().getFullYear()} TubeBridge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    );
}