import asyncio
import concurrent.futures
import os
import time

from scripts.scraping import StravaActivityScrapper


async def scrape_activity_async(activity_id: int):
    url = f'https://www.strava.com/activities/{activity_id}'
    activity_scraper = StravaActivityScrapper(url)

    try:
        loop = asyncio.get_running_loop()
        with concurrent.futures.ThreadPoolExecutor() as pool:
            result = await loop.run_in_executor(
                pool,
                activity_scraper.scrape,
                'xp_session_identifier', ' _strava4_sessio'
            )

        if result:
            activity_scraper.save_to_csv()
            return True
        return False
    except Exception as e:
        print(f"Error while activity {activity_id}: {e}")
        return False


async def main():
    os.makedirs('data', exist_ok=True)

    start_id = 14403024040
    end_id = start_id + 100000

    max_concurrent = 10
    semaphore = asyncio.Semaphore(max_concurrent)

    total_activities = end_id - start_id
    successful = 0
    start_time = time.time()

    async def bounded_scrape(activity_id):
        nonlocal successful
        async with semaphore:
            await asyncio.sleep(0.1)
            result = await scrape_activity_async(activity_id)
            if result:
                successful += 1
                if successful % 100 == 0:
                    elapsed = time.time() - start_time
                    activities_per_second = successful / elapsed if elapsed > 0 else 0
                    estimated_total = (total_activities / activities_per_second) if activities_per_second > 0 else 0
                    remaining = estimated_total - elapsed if estimated_total > 0 else 0
                    print(
                        f"Progress : {successful}/{total_activities} ({successful / total_activities * 100:.2f}%) | "
                        f"Speed: {activities_per_second:.2f} act/s | "
                        f"Time left: {remaining / 60:.2f} min")

    batch_size = 1000
    for batch_start in range(start_id, end_id, batch_size):
        batch_end = min(batch_start + batch_size, end_id)
        batch_tasks = [bounded_scrape(activity_id) for activity_id in range(batch_start, batch_end)]

        await asyncio.gather(*batch_tasks)
        print(f"Batch {(batch_start - start_id) // batch_size + 1}/{(end_id - start_id) // batch_size} finished")

    total_time = time.time() - start_time
    print(f"\nFinish! {successful} activity scraped with a success of {total_activities} tries.")
    print(f"Total time: {total_time / 60:.2f} minutes")


if __name__ == "__main__":
    asyncio.run(main())
