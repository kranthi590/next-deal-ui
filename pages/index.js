import styles from '../styles/Home.module.css'

function Home({ health }) {
  return (
    <div className={styles.container}>
      <h1>{health.status === 200 ? 'Im Healthy': 'Im Fractured' }</h1>
    </div>
  )
};

Home.getInitialProps = async () => {
    const res = await fetch('https://service.nextdeal.dev/health')
    const json = await res.json()
    return { health: json }
}

export default Home;