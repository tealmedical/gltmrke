import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header>
        <NavLink to="/">Tilbudsatlas</NavLink>
        <NavLink to="/hjælp!">Hjælp</NavLink>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="center">Send os dine gule mærker på <a href="mailto:hej@gultmærke.dk">📧 hej@gultmærke.dk</a></footer>
    </>
  )
}
