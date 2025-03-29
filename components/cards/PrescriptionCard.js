import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';

import NormalText from '../ui/NormalText';
import MediumText from '../ui/MediumText';
import HeaderText from '../ui/HeaderText';

import {colors} from '../../assets/styles';
import {getShortDate} from '../../utils/dateFormat';

export default function PrescriptionCard({prescriptions}) {
  const groupedPrescriptions = prescriptions.reduce((acc, prescription) => {
    const {prescription_id, ...rest} = prescription;
    if (!acc[prescription_id]) {
      acc[prescription_id] = {
        prescriptionDetails: {prescription_id, ...rest},
        labDetails: [],
      };
    }
    acc[prescription_id].labDetails.push({
      lab_id: prescription.lab_id,
      lab_name: prescription.lab_name,
      lab_price: prescription.lab_price,
    });
    return acc;
  }, {});

  // Step 2: Render the grouped data
  const renderPrescriptionViews = () => {
    return Object.values(groupedPrescriptions).map((group, index) => (
      <View style={styles.prescriptionCard} key={index}>
        <View style={styles.tagView}>
          <HeaderText
            styleProp={
              styles.codeStyle
            }>{`Prescription Code: ${group.prescriptionDetails.prescription_code}`}</HeaderText>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <NormalText>Assigned On:</NormalText>
          <NormalText>
            {`${getShortDate(
              group.prescriptionDetails.prescription_date_created,
            )}`}
          </NormalText>
        </View>

        {/* Render lab details in a list */}
        <MediumText>Lab Tests:</MediumText>
        <View>
          {group.labDetails.map((lab, labIndex) => (
            <View key={labIndex} style={styles.labView}>
              <NormalText boldProp>{`Test: ${lab.lab_name}`}</NormalText>
              <NormalText>{`Amount Paid: Ksh. ${lab.lab_price}`}</NormalText>
            </View>
          ))}
        </View>
      </View>
    ));
  };

  return <View>{renderPrescriptionViews()}</View>;
}

const styles = StyleSheet.create({
  prescriptionCard: {
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
  tagView: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    marginVertical: 5,
  },
  codeStyle: {
    fontSize: 14,
    color: colors.darkBlue,
  },
  labView: {
    borderLeftColor: colors.primaryPink,
    borderLeftWidth: 10,
    marginVertical: 5,
    borderRadius: 10,
    paddingLeft: 10,
  },
});
