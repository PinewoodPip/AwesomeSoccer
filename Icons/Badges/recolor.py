# This tool creates recolored versions of .svg files in the 'base' folder and puts them in Output/{recolor name}
# To use, create a file name 'recolor.txt' and there put the recolor name, new fill color and new stroke color, each in a new line

import os
import sys
import untangle

xml = open('recolor.xml')
config = untangle.parse(xml)
xml.close()

dir = os.fsencode(os.path.join(os.getcwd(), 'base')) # get folder containing the svgs to recolor
for recolor in config.root.recolor:
    print("Creating svgs with color theme '"+recolor['name']+"'")
    folderName = recolor["name"]

    for file in os.listdir(dir):
        filename = os.fsdecode(file)

        if filename.endswith('.svg'): # only open .svgs
            svg = open(os.path.join(dir, file))
            svgData = svg.read()
            svg.close()

            for color in recolor.color:
                svgData = svgData.replace(color.find.cdata, color.replace.cdata)

            if (os.path.isdir('Output/'+folderName) == False): # create the folder (if it doesn't exist)
                os.mkdir('Output/'+folderName)

            newFile = open('Output/'+folderName+'/'+os.path.basename(filename), 'w')
            newFile.write(svgData)
            newFile.close()
print("Done. Press enter to exit.")
input()
