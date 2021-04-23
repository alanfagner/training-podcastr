import { GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { api } from '../services/api'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../utils/converterDurationToTimeString'
import styles from './home.module.scss'
import Link from 'next/link'
import { usePlayer } from '../contexts/PlayerContext'


type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  allEpisodes: Episode[];
  latestEpisodes: Episode[];
}

export default function Home(props: HomeProps) {

  const { latestEpisodes, allEpisodes } = props;

  const episodeList = [...latestEpisodes, ...allEpisodes];

  const { playList } = usePlayer();


  return (
    <div className={styles.homepage}>

    <Head>
      <title>Home | Podcastr</title>
    </Head>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisodes.map((episode, index) => {

            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>{episode.title}</Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button onClick={() => playList(episodeList, index)} type="button">
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>PodCast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>

            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover" />
                  </td>

                  <td>
                    <Link href={`/episodes/${episode.id}`}>{episode.title}</Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button onClick={() => playList(episodeList, index + latestEpisodes.length)} type="button">
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>)
            })}
          </tbody>
        </table>

      </section>

    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'publish_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => ({
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
    url: episode.file.url,
  }))

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);


  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}