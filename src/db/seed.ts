import { client, db } from ".";
import { goalCompletions, goals } from "./schema";
import dayjs from 'dayjs';

async function seed() {
    console.log("Starting seed...");

    await db.delete(goalCompletions);
    await db.delete(goals);

    const result = await db
        .insert(goals)
        .values([
            {
                title: 'Beber 2L de água',
                desiredWeeklyFrequency: 2
            },
            {
                title: 'Ler 15mins por dia da semana',
                desiredWeeklyFrequency: 5
            },
            {
                title: 'Estudar 1h por dia da semana',
                desiredWeeklyFrequency: 5
            }
        ]).returning();

    console.log("Inserted goals:", result);

    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs().endOf('week');

    await db.insert(goalCompletions).values([
        { goalId: result[0].id, createdAt: startOfWeek.toDate() },
        { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
        { goalId: result[2].id, createdAt: endOfWeek.toDate() },
    ]).returning();

    console.log("Seed completed.");
}

seed().catch(error => {
    console.error("Seed failed:", error);
});
