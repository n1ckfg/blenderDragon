"""This script exports the keyframe values to CSV, header has component name and Index"""
"""It is intended to convert Keyframe data to Dragonframe MOCO"""

#Import modules
import bpy
import csv

#variable with the object in Blender context
ob = bpy.context.object

#Conditionals to execute if not empty
if ob is not None:
    if ob.animation_data is not None and ob.animation_data.action is not None:
        
        
        #Animation data in FCurves. These only go to 
        action = ob.animation_data.action   
        
        #We open the CSV file to save data. Enter directory path.
        with open('/Users/mauricio/Desktop/csv.csv','w',encoding='UTF8') as f:
        
            #With "For" Loop we iterate the object and FCurves data saved by Blender.
            #Prints data for X,Y,Z with component name and index.
            for fcu in action.fcurves:
                
                writer = csv.writer(f)
                writer.writerow([fcu.data_path,fcu.array_index])
                
                 
                for kp in fcu.keyframe_points:
                   
                    writer = csv.writer(f)
                    writer.writerow(kp.co[:])
                    
            print("Data exported to CSV successfully")