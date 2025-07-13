// styles/appStyles.ts
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const { height } = Dimensions.get('window');
const CARD_HEIGHT = 210;

export  const appStyles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },

  // 🔹 Time Picker
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 2,
    backgroundColor:'#f1f1f1',
    marginRight:5
  },

  // 🔹 Primary Button
  createBtn: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
    marginRight:8,
    marginTop:2
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e7d32', // green tone
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  

  // 🔹 Tabs/Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#f8f8f8',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
   list: {
    maxHeight: CARD_HEIGHT + 20,
    marginVertical: 0,
    flexGrow:0,
  },
  arrowContainer: {
    position: 'absolute',
    right: 200,
    top: '30%',
    zIndex: 10,
    alignItems: 'center',
  },
  card: {
    width: 300,
    height: CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
    backgroundColor: '#E0F7FA',
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 18,
  },
 
  time: {
    fontSize: 14,
    color: '#555',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#444',
  },
  offerButton: {
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  offerText: {
    color: '#fff',
    fontWeight: '600',
  },
  
  wrapper: {
  
    paddingVertical: 8,
    flex:1
  },


matchCard: {
  height: CARD_HEIGHT,
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 4,
  marginVertical: 2,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 5,
  elevation: 3,
  alignSelf:'center',
  width:'90%'
},

cardHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
},
metaRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 6,
},
timeText: {
  fontSize: 15,
  fontWeight: '500',
},

subduedText: {
  fontSize: 13,
  color: '#888',
},

avatarLarge: {
  width: 48,
  height: 48,
  borderRadius: 24,
  borderWidth: 2,
  borderColor: '#FF5722',
},

cardHeaderText: {
  marginLeft: 12,
  flex: 1,
},

name: {
  fontWeight: 'bold',
  fontSize: 16,
},

rating: {
  color: '#777',
  fontSize: 13,
  marginTop: 2,
},

timeAgo: {
  fontSize: 12,
  color: '#888',
},

routeRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginVertical: 8,
},

dotLineContainer: {
  width: 20,
  alignItems: 'center',
  marginRight: 8,
},

dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#999',
},

verticalLine: {
  width: 2,
  height: 24,
  backgroundColor: '#ccc',
  marginVertical: 2,
},

locationLabel: {
  fontSize: 12,
  color: '#999',
},

addressText: {
  fontSize: 14,
  color: '#333',
  fontWeight: '500',
},



offerRow: {
 flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginTop: 8,
},

offerPrice: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#111',
},

offerRideButton: {
  backgroundColor: 'green',
  paddingVertical: 10,
  flex:1,
  
  borderRadius: 8,
  paddingHorizontal: 10,
  width: '100%',
  marginTop: 0,
},
floatingPlusButton: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  backgroundColor: 'green',
  borderRadius: 30,
  width: 50,
  height: 50,
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#000',
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 5,
  zIndex: 100,
},
offerRideText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 12,
  marginRight: 6,
},
offerRowContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

offerPriceInside: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
},

offerTextWrapper: {
  flexDirection: 'row',
  alignItems: 'center',
},
offerIcon: {
  marginTop: 1,
},

referralRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 10,
},

referralText: {
  color: '#0047AB',
  fontSize: 13,
},

inviteText: {
  color: '#F44336',
  fontWeight: 'bold',
},


mainContainer :{
  backgroundColor: '#ffffff',
  flexDirection: 'column',
  flex:1
},
mapContanier : {
  flex: 2,
},
bottomContainer: {
  flex :1,

  flexDirection:'column'
},
createRiderContainter : {
  flex:1
},
inputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 2,
  marginVertical: 2,
},

inputFlex: {
  flex: 1,
  fontSize: 15,
  paddingHorizontal: 10,
  color: '#000',
},

iconLeft: {
  paddingRight: 6,
},

iconRight: {
  paddingLeft: 6,
},
offerContent: {
  flexDirection: 'row-reverse',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
},

inputRowFull: {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginVertical: 2,
  paddingHorizontal: 8,
  backgroundColor: '#fff',
},

inputTouchable: {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 6,
  backgroundColor:'#f1f1f1'
},

inputText: {
  fontSize: 14,
  color: '#333',
},

inputRowSplit: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginVertical: 1,
},

dropdown: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 4,
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  marginLeft:2,
  width:'50%'
},

dropdownText: {
  fontSize: 14,
  marginRight: 4,
},

sliderWrap: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
},
pickerWrap: {
  flexDirection: 'row',
  alignItems: 'center',
 
 
  paddingHorizontal: 8,
},
sliderLabel: {
  marginRight: 4,
  fontSize: 14,
  color: '#555',
},

messageBubble: {
  backgroundColor: '#e0e0e0',
  borderRadius: 12,
  padding: 10,
  marginBottom: 10,
  alignSelf: 'flex-start',
  maxWidth: '80%',
},
senderName: {
  fontWeight: 'bold',
  fontSize: 12,
  marginBottom: 4,
},
messageText: {
  fontSize: 14,
},
inputRowChat: {
  flexDirection: 'row',
  padding: 10,
  borderTopWidth: 1,
  borderColor: '#ccc',
  backgroundColor: '#fff',
},
chatInput: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 20,
  paddingHorizontal: 15,
  paddingVertical: 8,
  marginRight: 10,
},
sendButton: {
  backgroundColor: '#3b8d5e',
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 20,
},
sendButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
messageCard:{
  
},
messageContent:{

},
userImage:{

},
userName:{

},
lastMessage :{
  
}
});
console.log('✅ appStyles loaded');
console.log(appStyles?.container);
