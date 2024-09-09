
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TouchableOpacity,ScrollView,Dimensions,Modal,TextInput,Button, Alert } from 'react-native';
import { CurrentRenderContext, NavigationContainer, useNavigation } from '@react-navigation/native';
import { useState,useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import CreateProjectPage from './projectTemplate';
import { addProject,getProjectList,deleteListProject} from './database';

const screenWidth = Dimensions.get('window').width;
const buttonWidth = screenWidth * 0.15





const Stack = createStackNavigator();

function Projects({ navigation }) {

 const [titleInputVisible, setTitleInputVisible] = useState(false);
  const [title, setTitle] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectEmpty,setProjectEmpty]=useState(false)

  const createNewProject = async() => {
    if (title) {
      await addProject(title)
      const newList=await getProjectList()
      setProjects(newList);
      navigation.navigate('Projects', { title });
      setTitle(null);
      setTitleInputVisible(false);
    }
  };

  const deleteProject = async (id) => {
    try {
        await deleteListProject(id);
        const updatedList = await getProjectList(); 
        setProjects(updatedList); 
    } catch (error) {
        console.error('Error deleting project:', error);
    }
};
  useEffect(() => {
    const loadProject = async () => {
      try {
        const projectList = await getProjectList()|| []; // get project list
        await setProjects(projectList); // Update state with db list
        console.log("Project List:", projectList)
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
    loadProject()
  },[])
  
  // check if project is not empty if it is display a text saying no project yet
  useEffect(() => { 
    const checkIfProjectsEmpty=projects===null || projects==="" || projects.length==0 ? setProjectEmpty(true): setProjectEmpty(false)
  })
 

  return (
    // modal for title
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={titleInputVisible}
        onRequestClose={() => setTitleInputVisible(false)}
      >
        <View style={styles.formContainer}>
          <TextInput
            style={[styles.userInput, styles.whiteBg]}
            placeholder="Set Project title"
            value={title}
            onChangeText={text => setTitle(text)}
          />
          <View style={styles.buttonSpacing }>
            <Button title="Confirm Project" onPress={createNewProject} />
          </View>
          <View style={styles.buttonSpacing }>
          <Button title="Cancel" onPress={() => setTitleInputVisible(false)} />
          </View>
        </View>
      </Modal>


      <ScrollView style={styles.projectMapping}>
        {projectEmpty==false ? (
            projects.map(project => (
              <View key={project.id} style={styles.projectItem}>
              
              <TouchableOpacity
                  onPress={() => {navigation.navigate('Project', { title: project.title, id: project.id }) }}
                 >
                <Text style={styles.projectTitle}>Project:{project.title}</Text>
                
                  <Text style={styles.viewDetails}>View Details</Text>
                </TouchableOpacity>
                  <Button title="Delete" onPress={() => deleteProject(project.id)} />
                  
              </View>
            ))) : (
            <Text style={styles.noProject }>No projects available</Text>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonGreen}
        onPress={() => setTitleInputVisible(true)}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}


function ProjectsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProjectsList" component={Projects} />
      <Stack.Screen name="Project" component={CreateProjectPage} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGreen: {
    bottom: 20,
    right: -150,
    backgroundColor: 'green',
    width: buttonWidth,
    height: buttonWidth,
    borderRadius: buttonWidth / 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  userInput: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  whiteBg: {
    backgroundColor: 'white',
  },

  projectItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },

  projectMapping: {
    width: "100%",
  },

  viewDetails: {
    textAlign: "center",
    paddingBottom: 20,
    color:"blue"
  },
  
  buttonSpacing: {
    paddingTop:5
  },
 

  noProject: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight:500
  },

  projectTitle: {
    fontSize: 20,
    fontStyle: "bold",
    textAlign: "center",
    padding:10
  }
});

export default ProjectsStack;


