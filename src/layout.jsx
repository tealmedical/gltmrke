import './globals.css'

export default function Layout({ children }) {
  return (
    <>
      <main>
        {children}
      </main>
      <footer className="center">Send os dine gule mærker på <a href="mailto:hej@gultmærke.dk">📧 hej@gultmærke.dk</a></footer>
    </>
  )
}
