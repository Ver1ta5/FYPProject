import {
    onMonthlyResetBudget, insertMonthlyReset, getMonthlyReset, updateMonthlyReset, getTotalPersonalSpent,
    getPersonalRemainingBudget, getStatistics, insertIntoStatistics, updateStatistics
} from './database';


const checkIfBudgetMaintained =async () => {
    //     // Since the task is not completed this month shift the
//         //current task to next month budget
    const remainingTaskBudget = await getTotalPersonalSpent()
    console.log('remainingTaskBudget.stat:',remainingTaskBudget)
    const remainingBudget = await getPersonalRemainingBudget()||0
    console.log('remainingBudget.stat:',remainingBudget)
    const budgetSaved = remainingBudget + remainingTaskBudget
    return budgetSaved
}

const onMonthReset = async () => {
    try {
        // Get last month saved
        const previousMonthSaved = await checkIfBudgetMaintained();

        // get statistics
        const statistics = await getStatistics();
        
        if (!statistics || statistics.length === 0) {
            // If statistics are null or empty, insert default values
            await insertIntoStatistics(previousMonthSaved, 0, 0, 0, 0);
            console.log("Default stats inserted");
            return;
        }
        else { 
           
        let { lastMonthSaved = 0, totalSaved = 0, MWB = 0, maxStreak = 0, currentStreak = 0 } = statistics[0];
        
        // Calculate values to insert into database
        const totalSaving = totalSaved + previousMonthSaved;
        let newMWB = MWB;
        let newCurrentStreak = currentStreak;
        
        if (lastMonthSaved >= 0) {
            newMWB += 1;
            newCurrentStreak += 1;
            if (newCurrentStreak > maxStreak) {
                maxStreak = newCurrentStreak;
            }
        }

        console.log("Statistics data:", { lastMonthSaved, totalSaved, MWB, maxStreak, currentStreak });

        // Update statistics
        await updateStatistics(previousMonthSaved, totalSaving, newMWB, maxStreak, newCurrentStreak);
        console.log("Statistics updated");

        // Perform monthly budget reset
        await onMonthlyResetBudget();
        }
        
      
    } catch (error) {
        console.error('Error executing onMonthReset:', error);
    }
};

   
let isResetScheduled = false;

const callAtEndOfMonth = async () => {
    console.log("End of month reached. Executing function...");

    try {
     
        await onMonthReset();

   
        await updateResetDate();

    
        await scheduleEndOfMonth();
    } catch (error) {
        console.error("Error in callAtEndOfMonth:", error);
    }
};


const updateResetDate = async () => {
    const currentDate = new Date();
    const nextResetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

   
    await updateMonthlyReset(nextResetDate);
  
};



const areDatesEqualIgnoringTime = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
};



export const scheduleEndOfMonth = async () => {
    if (isResetScheduled) {
        console.log("Resetting Budget Counter");
        return;
    }
    isResetScheduled = true;

    try {
        //get current reset date
        const currentResetDate = await getMonthlyReset();
        //get current date
        const currentDate = new Date();

        // check if currentResetDate is valid, needed because initially when first starting it may not have it
        const isValidDate = (date) => {
            return date instanceof Date && !isNaN(date.getTime());
        };
          
        if (isValidDate(currentResetDate)) {
            const resetDate = new Date(currentResetDate);

            if (areDatesEqualIgnoringTime(currentDate, resetDate) || currentDate > resetDate) {
                await callAtEndOfMonth();
            } else {
                const timeUntilReset = resetDate - currentDate;
                setTimeout(async () => {
                    try {
                        await callAtEndOfMonth();
                    } catch (error) {
                        console.error("Error calling callAtEndOfMonth:", error);
                    } finally {
                        isResetScheduled = false; 
                    }
                }, timeUntilReset);
            }
        } else {
            const newResetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

            await insertMonthlyReset(newResetDate);

            const timeUntilReset = newResetDate - currentDate;
         
            setTimeout(async () => {
                try {
                    await callAtEndOfMonth();
                } catch (error) {
                    console.error("Error during callAtEndOfMonth:", error);
                } finally {
                    isResetScheduled = false; 
                }
            }, timeUntilReset);
        }
    } catch (error) {
        console.error("Error in scheduleEndOfMonth:", error);
    } finally {
        isResetScheduled = false; 
    }
};
