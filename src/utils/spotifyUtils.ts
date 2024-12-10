interface Track {
  name: string;
  artists: { name: string }[];
  album: { release_date: string; images: { url: string }[] };
  popularity: number;
}

export async function fetchFavoriteTracks(token: string): Promise<Track[]> {
  const limit = 50;
  let offset = 0;
  let allTracks: Track[] = [];
  let totalFetched = 0;

  do {
    const result = await fetch(
      `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await result.json();

    if (data.items && data.items.length > 0) {
      allTracks = allTracks.concat(data.items.map((item: any) => item.track));
      totalFetched = data.items.length;
      offset += totalFetched;
    } else {
      totalFetched = 0; // End the loop if no more items
    }
  } while (totalFetched > 0 && offset <= 50);

  return allTracks;
}

export function getRandomTrack(tracks: Track[]): Track {
  const randomIndex = Math.floor(Math.random() * tracks.length);
  return tracks[randomIndex];
}

export function generateTrackQuestion(track: Track, questionType: string) {
  let question: string = "",
    correctAnswer: string | number = "";

  switch (questionType) {
    case "release_date":
      question = `When was "${track.name}" by ${track.artists[0].name} released?`;
      correctAnswer = new Date(track.album.release_date).getFullYear();
      break;

    case "artist":
      question = `Who is the artist that made "${track.name}"?`;
      correctAnswer = track.artists[0].name;
      break;

    case "popularity":
      const popularity = track.popularity;
      question = `Is the popularity of "${track.name}" higher or lower than 50?`;
      correctAnswer = popularity > 50 ? "higher" : "lower";
      break;

    case "album_cover":
      question = `Identify the album cover for "${track.name}" by ${track.artists[0].name}.`;
      correctAnswer = track.album.images[0].url;
      break;

    // In case of an emergency
    default:
      throw new Error(`Unsupported question type: ${questionType}`);
  }

  return { question, correctAnswer, questionType };
}

export function generateAnswerOptions(
  correctAnswer: string | number,
  questionType: string,
  tracks: Track[]
): (string | number)[] {
  let options: (string | number)[] = [];

  switch (questionType) {
    case "release_date":
      const correctYear = correctAnswer as number;
      options = [
        correctYear,
        correctYear - 1,
        correctYear + 1,
        correctYear + 2,
      ];
      break;

    case "artist":
      const randomArtists: string[] = [];
      for (let i = 0; i < 3; i++) {
        const randomTrack = getRandomTrack(tracks);
        const artistName = randomTrack.artists[0].name;
        if (
          !randomArtists.includes(artistName) &&
          artistName !== correctAnswer
        ) {
          randomArtists.push(artistName);
        }
      }
      options = [correctAnswer, ...randomArtists.slice(0, 3)];
      break;

    case "popularity":
      options = ["Higher", "Lower"];
      break;

    case "album_cover":
      const randomTracks = [];
      for (let i = 0; i < 3; i++) {
        randomTracks.push(getRandomTrack(tracks));
      }

      options = randomTracks.map((track) => track.album.images[0].url);
      options.push(correctAnswer as string); // Ensure it's treated as a string
      break;
  }

  return options.sort(() => Math.random() - 0.5);
}
