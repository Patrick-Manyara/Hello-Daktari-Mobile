import {StyleSheet} from 'react-native';
import {colors} from './colors';
import {Platform} from 'react-native';

export const css = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    paddingTop: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  centerText: {
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryGrey,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  disabledContainer: {
    backgroundColor: colors.secondaryGrey,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'column',
    marginVertical: 5,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F4F5F7',
  },
  icon: {
    fontSize: 20,
    color: 'grey',
  },
  smallerText: {
    fontSize: 16,
    marginTop: 5,
  },
  viewCard: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    elevation: 4,
    padding: 10,
    // IOS
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    backgroundColor: 'white',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  card: {
    width: '95%',
    backgroundColor: colors.secondaryGrey,
    margin: 5,
    borderRadius: 8,
    elevation: 4,
    padding: 5,
    // IOS
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    backgroundColor: 'white',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  whiteText: {
    color: 'white',
  },
  smallerCard: {
    margin: 5,
    borderRadius: 8,
    elevation: 4,
    padding: 10,
    // IOS
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    backgroundColor: 'white',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  buttonMinus: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',

    borderRightColor: colors.secondaryBlue,
    borderRightWidth: 2,

    borderLeftColor: colors.secondaryBlue,
    borderLeftWidth: 2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,

    borderTopColor: colors.secondaryBlue,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondaryBlue,
  },
  buttonPlus: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',

    borderLeftColor: colors.secondaryBlue,
    borderLeftWidth: 2,

    borderRightColor: colors.secondaryBlue,
    borderRightWidth: 2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,

    borderTopColor: colors.secondaryBlue,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondaryBlue,
  },
  textContainer: {
    borderTopColor: colors.secondaryBlue,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderBottomColor: colors.secondaryBlue,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
  },

  button: {
    width: 'auto',
  },
  buttonPressed: {
    opacity: 0.5,
  },

  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  optionColumn: {
    flexBasis: '33.333%',
    alignItems: 'center',
  },
  subTotal: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  deeFlex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deeBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deeStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flexColumn: {
    flexBasis: '33.333%',
    alignItems: 'center', // Center content horizontally
  },
  displayStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  displayFlex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
