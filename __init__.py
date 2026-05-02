"""Blender addon to export keyframe data to Dragonframe MOCO CSV format"""

bl_info = {
    "name": "Dragon Moco Exporter",
    "author": "Mauricio, Nick Fox-Gieg",
    "version": (1, 0, 0),
    "blender": (5, 1, 0),
    "location": "File > Export > Dragon Moco (.csv)",
    "description": "Export keyframe animation data to Dragonframe MOCO CSV format",
    "category": "Import-Export",
}

import bpy
import csv
from bpy_extras.io_utils import ExportHelper
from bpy.props import StringProperty
from bpy.types import Operator


class EXPORT_OT_dragon_moco(Operator, ExportHelper):
    """Export animation keyframes to Dragonframe MOCO CSV format"""
    bl_idname = "export_anim.dragon_moco"
    bl_label = "Export Dragon Moco"
    bl_options = {'REGISTER', 'UNDO'}

    filename_ext = ".csv"

    filter_glob: StringProperty(
        default="*.csv",
        options={'HIDDEN'},
        maxlen=255,
    )

    def execute(self, context):
        ob = context.object

        if ob is None:
            self.report({'ERROR'}, "No active object selected")
            return {'CANCELLED'}

        if ob.animation_data is None or ob.animation_data.action is None:
            self.report({'ERROR'}, "Active object has no animation data")
            return {'CANCELLED'}

        action = ob.animation_data.action

        try:
            with open(self.filepath, 'w', encoding='UTF8', newline='') as f:
                writer = csv.writer(f)

                for fcu in action.fcurves:
                    writer.writerow([fcu.data_path, fcu.array_index])

                    for kp in fcu.keyframe_points:
                        writer.writerow(kp.co[:])

            self.report({'INFO'}, f"Data exported to {self.filepath}")
            return {'FINISHED'}

        except Exception as e:
            self.report({'ERROR'}, f"Export failed: {str(e)}")
            return {'CANCELLED'}


def menu_func_export(self, context):
    self.layout.operator(EXPORT_OT_dragon_moco.bl_idname, text="Dragon Moco (.csv)")


def register():
    bpy.utils.register_class(EXPORT_OT_dragon_moco)
    bpy.types.TOPBAR_MT_file_export.append(menu_func_export)


def unregister():
    bpy.types.TOPBAR_MT_file_export.remove(menu_func_export)
    bpy.utils.unregister_class(EXPORT_OT_dragon_moco)


if __name__ == "__main__":
    register()
