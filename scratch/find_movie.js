async function findMovie(query) {
    for (let i = 1; i <= 100; i++) {
        console.log(`Checking page ${i}...`);
        const res = await fetch(`https://vidapi.ru/movies/latest/page-${i}.json`);
        if (!res.ok) break;
        const data = await res.json();
        const items = data.items || [];
        const found = items.find(item => item.title.toLowerCase().includes(query.toLowerCase()));
        if (found) {
            console.log(`Found on page ${i}:`, found);
            return;
        }
    }
    console.log("Not found in first 100 pages.");
}

findMovie("shawshank");
