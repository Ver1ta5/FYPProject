

import { StyleSheet, Text, View} from 'react-native';
import { useState,useEffect} from 'react'
import { getStatistics } from './database';




function StatisticPage(){
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const statistics = await getStatistics();
                console.log('statPage:', statistics);
                setStats(statistics);
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
            }
        };

        getData();
    }, []);

    // Default values if stats is null or stats[0] is undefined
    const defaultStats = {
        lastMonthSaved: 0,
        totalSaved: 0,
        MWB: 0,
        maxStreak: 0,
        currentStreak: 0
    };

    // Destructure with fallback
    const { lastMonthSaved, totalSaved, MWB, maxStreak, currentStreak } = stats && stats[0]
        ? stats[0]
        : defaultStats;

    // Text color based on values
    const LastMonthTextColour = lastMonthSaved < 0 ? styles.overbudget : styles.savings;
    const totalSavedTextColour = totalSaved < 0 ? styles.overbudget : styles.savings;

    return (
        <View style={styles.container}>
            {/* Total saved stat */}
            <Text style={[styles.textStyle,styles.topPadding]}>Total Saved:</Text>
            <Text style={[styles.textStyle, totalSavedTextColour, styles.textPadding]}>  ${totalSaved} </Text>

            {/* Last month saved stat */}
            <Text style={styles.textStyle}>Saved Last Month:</Text>
            <Text style={[styles.textStyle, LastMonthTextColour, styles.textPadding]}>  ${lastMonthSaved}</Text>

            {/* MWB stats */}
            <Text style={styles.textStyle}>Months Within Budget (MWB):</Text>
            <Text style={[styles.textStyle, styles.textPadding]}>{MWB} {MWB === 1 ? 'Month' : 'Months'}  </Text>

            {/* Max streak stat */}
            <Text style={styles.textStyle}>Max Streak For MWB:</Text>
            <Text style={[styles.textStyle, styles.textPadding]}>  {maxStreak} {maxStreak === 1 ? 'Month' : 'Months'} </Text>

            {/* Current streak stat */}
            <Text style={styles.textStyle}>Current Streak For MWB:</Text>
            <Text style={styles.textStyle}> {currentStreak} {currentStreak === 1 ? 'Month' : 'Months'} </Text>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2C2C2C',
      
    },

    topPadding: {
     paddingTop:100
    },

    textStyle: {
    color:"white",
    fontSize:25,
    paddingleft: 10,
    paddingTop: 5,
     textAlign: 'center'
    },

    textPadding: {
       paddingBottom:15
   
        },

    overbudget: {
        color:'red'
    },

    savings: {
        color:'green'
    },
     
   
    
});
  
  export default StatisticPage;