
import { Button, Dropdown, Modal, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi";

export const NavbarWidget = () => {
  const { data, status } = useSession();
  const [openModalLogout, setOpenModalLogout] = useState(false);

  const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

    return (
      <Navbar className="bg-green-600 !px-24 relative overflow-visible" fluid={false} theme={{ 
        link: {
          active: {
            off: "text-gray-300",
            on: "text-white",
          }
        },
       }} >
      <NavbarBrand as={Link} href="https://flowbite-react.com">
        <img src="https://jajalenpas.pasuruankab.com/logo.png" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">Kab.Pasuruan</span>
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink  href="#" active>
          Peta
        </NavbarLink>
        <NavbarLink  as={Link} href="#">
          Laporan
        </NavbarLink>
        { status == "authenticated" && (
          <Dropdown label={<span className="text-white">Hi, Admin</span>} inline={true} className="z-[9999]" arrowIcon={false}>
            <Dropdown.Header>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">bonnie@flowbite.com</span>
            </Dropdown.Header>
            <Dropdown.Item icon={HiViewGrid}>Dashboard</Dropdown.Item>
            <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
            <Dropdown.Item icon={HiCurrencyDollar}>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setOpenModalLogout(true)} icon={HiLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        )}
        { status == "unauthenticated" && (
          <NavbarLink  href="/auth/signin">Login</NavbarLink>
        )}
      </NavbarCollapse>

      {/* modal logout  */}
      <Modal dismissible show={openModalLogout} onClose={() => setOpenModalLogout(false)} className="z-[9999]">
        <form onSubmit={handleLogout}>
        <Modal.Header>Konfirmasi</Modal.Header>
        <Modal.Body>
          <p>
            Apakah anda yakin ingin keluar?
          </p>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-1">
          <Button type="submit" className="bg-red-500">Keluar</Button>
          <Button color="gray" onClick={() => setOpenModalLogout(false)}>
            Tutup
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
      {/* end modal logout  */}
    </Navbar>
    )
}